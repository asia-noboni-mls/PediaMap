import { fetchProviders, fetchProviderDetails } from './fetch-helpers.js';
import {
  renderProviderList,
  renderProviderDetails,
  renderDetailsPlaceholder,
  showLoading,
  showError,
} from './dom-helpers.js';

// Grab DOM elements we'll need
const providerListEl = document.getElementById('provider-list');
const providerDetailsEl = document.getElementById('provider-details');
const searchForm = document.getElementById('search-form');

// Called when the user clicks a provider card
async function handleProviderClick(provider) {
  showLoading(providerDetailsEl);

  try {
    const fullProvider = await fetchProviderDetails(provider.number);
    renderProviderDetails(providerDetailsEl, fullProvider);
  } catch (error) {
    showError(providerDetailsEl, error.message);
  }
}

// Called when the search form is submitted
async function handleSearchSubmit(event) {
  // Prevents the page from reloading on form submit
  event.preventDefault();

  // Read the values the user typed in
  const formData = new FormData(searchForm);
  const city = formData.get('city');
  const state = formData.get('state');

  // Clear the form inputs after grabbing the values
  searchForm.reset();

  // Show loading states while we fetch
  showLoading(providerListEl);
  renderDetailsPlaceholder(providerDetailsEl);

  try {
    const providers = await fetchProviders(city, state);
    renderProviderList(providerListEl, providers, handleProviderClick);
  } catch (error) {
    showError(providerListEl, error.message);
  }
}

// Runs once on page load — fetches a default list so the page isn't empty
async function init() {
  showLoading(providerListEl);
  renderDetailsPlaceholder(providerDetailsEl);

  try {
    const providers = await fetchProviders('Boston', 'MA');
    renderProviderList(providerListEl, providers, handleProviderClick);
  } catch (error) {
    showError(providerListEl, error.message);
  }
}

searchForm.addEventListener('submit', handleSearchSubmit);

init();