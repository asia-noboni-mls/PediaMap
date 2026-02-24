import { fetchProviders, fetchProviderDetails } from './fetch-helpers.js';
import {
  renderProviderList,
  renderProviderDetails,
  showLoading,
  showError,
  saveFavorite,
  removeFavorite,
  renderFavorites,
  filterProviders,
  addFavoriteButton,
  addProviderMap,
} from './dom-helpers.js';

// DOM elements
const providerGridEl = document.getElementById('provider-grid');
const favoritesGridEl = document.getElementById('favorites-grid');
const searchForm = document.getElementById('search-form');
const modalOverlay = document.getElementById('modal-overlay');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalContentEl = document.getElementById('modal-content');
const genderFilter = document.getElementById('gender-filter');
const typeFilter = document.getElementById('type-filter');

// Stores the full fetched provider list for filtering
let allProviders = [];

// Open modal
function openModal() {
  modalOverlay.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
  modalOverlay.setAttribute('hidden', '');
  document.body.style.overflow = '';
  modalContentEl.innerHTML = '';
}

modalCloseBtn.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (event) => {
  if (event.target === modalOverlay) closeModal();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});

// Save a provider to favorites and re-render the favorites grid
function handleSaveFavorite(provider) {
  saveFavorite(provider);
  renderFavorites(favoritesGridEl, handleRemoveFavorite);
}

// Remove a provider from favorites and re-render the favorites grid
function handleRemoveFavorite(npi) {
  removeFavorite(npi);
  renderFavorites(favoritesGridEl, handleRemoveFavorite);
}

// Filter the in-memory provider list and re-render
function applyFilters() {
  const gender = genderFilter.value;
  const type = typeFilter.value;
  const filtered = filterProviders(allProviders, gender, type);
  renderProviderList(providerGridEl, filtered, handleProviderClick);
}

genderFilter.addEventListener('change', applyFilters);
typeFilter.addEventListener('change', applyFilters);

// Fetch and display provider details in the modal
async function handleProviderClick(provider) {
  showLoading(modalContentEl);
  openModal();

  try {
    const fullProvider = await fetchProviderDetails(provider.number);
    renderProviderDetails(modalContentEl, fullProvider);
    addProviderMap(modalContentEl, fullProvider);
    addFavoriteButton(modalContentEl, fullProvider, handleSaveFavorite);
  } catch (error) {
    showError(modalContentEl, error.message);
  }
}

// Handle search form submission
async function handleSearchSubmit(event) {
  event.preventDefault();

  const formData = new FormData(searchForm);
  const city = formData.get('city');
  const state = formData.get('state');

  searchForm.reset();

  // Reset filters when a new search is made
  genderFilter.value = 'all';
  typeFilter.value = 'all';

  showLoading(providerGridEl);

  try {
    const providers = await fetchProviders(city, state);
    allProviders = providers;
    renderProviderList(providerGridEl, providers, handleProviderClick);
  } catch (error) {
    showError(providerGridEl, error.message);
  }
}

// Initial page load
async function init() {
  showLoading(providerGridEl);
  renderFavorites(favoritesGridEl, handleRemoveFavorite);

  try {
    const providers = await fetchProviders('Boston', 'MA');
    allProviders = providers;
    renderProviderList(providerGridEl, providers, handleProviderClick);
  } catch (error) {
    showError(providerGridEl, error.message);
  }
}

searchForm.addEventListener('submit', handleSearchSubmit);

init();