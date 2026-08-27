// The NPI Registry API doesn't send CORS headers, so browsers can't call it
// directly. In dev, Vite's own server proxies /npi-api -> the real API
// (see vite.config.js), so no third-party proxy is needed at all locally.
// In production (static GitHub Pages hosting), we fall back to public CORS
// proxies, trying each in turn since free proxies are unreliable.
const CORS_PROXIES = [
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
];

const REQUEST_TIMEOUT_MS = 8000;

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchNpiApi(apiUrl) {
  if (import.meta.env.DEV) {
    const devUrl = apiUrl.replace('https://npiregistry.cms.hhs.gov/api/', '/npi-api/');
    const response = await fetchWithTimeout(devUrl);
    if (!response.ok) throw new Error('Could not reach the provider directory. Please try again.');
    return response.json();
  }

  let lastError;
  for (const buildProxyUrl of CORS_PROXIES) {
    try {
      const response = await fetchWithTimeout(buildProxyUrl(apiUrl));
      if (!response.ok) throw new Error(`Proxy responded with ${response.status}`);
      return await response.json();
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error('Could not reach the provider directory. Please try again in a moment.');
}

export async function fetchProviders(city, state) {
  const apiUrl = `https://npiregistry.cms.hhs.gov/api/?version=2.1&city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&taxonomy_description=pediatrics&limit=10`;
  const data = await fetchNpiApi(apiUrl);
  return data.results || [];
}

export async function fetchProviderDetails(npi) {
  const apiUrl = `https://npiregistry.cms.hhs.gov/api/?version=2.1&number=${npi}`;
  const data = await fetchNpiApi(apiUrl);
  if (!data.results || !data.results[0]) throw new Error('Provider details not found.');
  return data.results[0];
}
