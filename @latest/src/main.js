import { fetchProviders, fetchProviderDetails } from "./fetch-helpers.js";
import { } from './dom-helpers.js'

const providerListEl = document.getElementById('provider-list');
const providerDetailsEl = document.getElementById('provider-details');

async function handleProviderClick(provider) {
  showLoading(providerDetailsEl, 'Loading provider details...');

  try {
    const fullProvider = await fetchProviderDetails(provider.number);
    renderProviderDetails(providerDetailsEl, fullProvider);
  } catch (error) {
    showError(providerDetailsEl, error.message);
  }
}

async function init() {
  showLoading(providerListEl, 'Finding providers...');
  renderPlaceholder(providerDetailsEl);

  try {
    const providers = await fetchProviders('Boston', 'MA');
    renderProviderList(providerListEl, providers, handleProviderClick);
  } catch (error) {
    showError(providerListEl, error.message);
  }
}

init();