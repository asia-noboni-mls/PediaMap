export async function fetchProviders(city, state) {
    const apiUrl = `https://npiregistry.cms.hhs.gov/api/?version=2.1&city=${city}&state=${state}&taxonomy_description=pediatrics&limit=10`;
    const url = `https://corsproxy.io/?${encodeURIComponent(apiUrl)}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Could not fetch providers. Please try again.');
    const data = await response.json();
    return data.results;
}

export async function fetchProviderDetails(npi) {
    const apiUrl = `https://npiregistry.cms.hhs.gov/api/?version=2.1&number=${npi}`;
    const url = `https://corsproxy.io/?${encodeURIComponent(apiUrl)}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Could not fetch provider details. Please try again.');
    const data = await response.json();
    return data.results[0];
}