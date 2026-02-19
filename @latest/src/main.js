import { fetchProviders, fetchProviderDetails } from './fetch-helpers.js';
import { renderProviderList, renderProviderDetails, showLoading, showError } from './dom-helpers.js';

// ── Grab DOM elements ──────────────────────────────────────
const providerGridEl = document.getElementById('provider-grid');
const searchForm = document.getElementById('search-form');
const modalOverlay = document.getElementById('modal-overlay');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalContentEl = document.getElementById('modal-content');

// ── Modal: open ────────────────────────────────────────────
function openModal() {
  // Remove the 'hidden' attribute so the modal becomes visible
  modalOverlay.removeAttribute('hidden');
  // Prevent the page from scrolling while the modal is open
  document.body.style.overflow = 'hidden';
}

// ── Modal: close ───────────────────────────────────────────
function closeModal() {
  // Add 'hidden' back to hide the modal
  modalOverlay.setAttribute('hidden', '');
  // Restore page scrolling
  document.body.style.overflow = '';
  // Clear the modal content so stale data doesn't flash next time
  modalContentEl.innerHTML = '';
}

// ── Close modal when X button is clicked ──────────────────
modalCloseBtn.addEventListener('click', closeModal);

// ── Close modal when clicking the dark overlay background ──
modalOverlay.addEventListener('click', (event) => {
  // Only close if the user clicked the overlay itself,
  // not the white card inside it
  if (event.target === modalOverlay) closeModal();
});

// ── Close modal when pressing the Escape key ──────────────
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});

// ── Called when a provider card is clicked ─────────────────
async function handleProviderClick(provider) {
  // Show a loading spinner inside the modal and open it
  showLoading(modalContentEl);
  openModal();

  try {
    // Fetch the full details for this provider using their NPI number
    const fullProvider = await fetchProviderDetails(provider.number);
    // Render the details into the modal content area
    renderProviderDetails(modalContentEl, fullProvider);
  } catch (error) {
    showError(modalContentEl, error.message);
  }
}

// ── Called when the search form is submitted ───────────────
async function handleSearchSubmit(event) {
  event.preventDefault(); // Stop the page from reloading

  const formData = new FormData(searchForm);
  const city = formData.get('city');
  const state = formData.get('state');

  searchForm.reset(); // Clear the form inputs

  showLoading(providerGridEl);

  try {
    const providers = await fetchProviders(city, state);
    renderProviderList(providerGridEl, providers, handleProviderClick);
  } catch (error) {
    showError(providerGridEl, error.message);
  }
}

// ── Runs once on page load ─────────────────────────────────
async function init() {
  showLoading(providerGridEl);

  try {
    const providers = await fetchProviders('Boston', 'MA');
    renderProviderList(providerGridEl, providers, handleProviderClick);
  } catch (error) {
    showError(providerGridEl, error.message);
  }
}

// Listen for form submissions
searchForm.addEventListener('submit', handleSearchSubmit);

// Kick everything off!
init();