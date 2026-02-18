const BASE_URL = 'https://npiregistry.cms.hhs.gov/api/';

export async function fetchProviders(city, state) {
    const url = `${BASE_URL}?version=2.1&city=${city}&state=${state}&taxonomy_description=pediatrics&limit=10`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Could not fetch providers. Please try again.');
    }
    const data = await response.json();
    return data.results;
}

export async function fetchProviderDetails(npi) {
    const url = `${BASE_URL}?version=2.1&number=${npi}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Could not fetch provider details. Please try again.');
    }

    const data = await response.json();
    return data.results[0];
}