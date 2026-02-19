// ── Helper: get a provider's display name ──────────────────
function getProviderName(provider) {
  const basic = provider.basic;
  if (basic.organization_name) return basic.organization_name;
  const name = [basic.first_name, basic.last_name].filter(Boolean).join(' ');
  return name || 'Unknown Provider';
}

// ── Helper: get a provider's city and state ────────────────
function getProviderLocation(provider) {
  const addresses = provider.addresses;
  const location = addresses.find(a => a.address_purpose === 'LOCATION') || addresses[0];
  if (!location) return 'Location unavailable';
  return `${location.city}, ${location.state}`;
}

// ── Render the provider grid ───────────────────────────────
// gridEl: the #provider-grid div
// providers: array of provider objects from the API
// onCardClick: function to call when a card is clicked
export function renderProviderList(gridEl, providers, onCardClick) {
  gridEl.innerHTML = '';

  if (!providers || providers.length === 0) {
    gridEl.innerHTML = '<p class="error">No providers found. Try a different city or state.</p>';
    return;
  }

  providers.forEach((provider, index) => {
    const name = getProviderName(provider);
    const location = getProviderLocation(provider);

    // Create the card element
    const card = document.createElement('div');
    card.className = 'provider-card';

    // Stagger the animation so cards appear one by one
    card.style.animationDelay = `${index * 60}ms`;

    card.innerHTML = `
      <div class="card-avatar">👶</div>
      <div class="card-name">${name}</div>
      <div class="card-location">📍 ${location}</div>
      <div class="card-cta">View Details →</div>
    `;

    // When the card is clicked, call the function passed in from main.js
    card.addEventListener('click', () => onCardClick(provider));

    gridEl.appendChild(card);
  });
}

// ── Render provider details inside the modal ───────────────
export function renderProviderDetails(modalContentEl, provider) {
  const basic = provider.basic;
  const addresses = provider.addresses;
  const taxonomies = provider.taxonomies;

  const name = getProviderName(provider);
  const credential = basic.credential || '';

  // Get the practice address
  const addr = addresses.find(a => a.address_purpose === 'LOCATION') || addresses[0] || {};
  const street = [addr.address_1, addr.address_2].filter(Boolean).join(', ');
  const cityStateZip = [addr.city, addr.state, addr.postal_code?.slice(0, 5)].filter(Boolean).join(', ');
  const fullAddress = [street, cityStateZip].filter(Boolean).join('<br>') || 'Not available';

  // Format phone number
  const rawPhone = addr.telephone_number || '';
  const digits = rawPhone.replace(/\D/g, '');
  const phone = digits.length === 10
    ? `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
    : rawPhone || 'Not available';

  // Get specialty
  const taxonomy = taxonomies.find(t => t.primary) || taxonomies[0] || {};
  const specialty = taxonomy.desc || 'Pediatrics';

  modalContentEl.innerHTML = `
    <div class="modal-header">
      <div class="modal-avatar">🩺</div>
      <div id="modal-provider-name" class="modal-name">${name}</div>
      ${credential ? `<div class="modal-credential">${credential}</div>` : ''}
    </div>
    <div class="modal-body">
      <div class="modal-detail-row">
        <div class="modal-detail-icon">🏥</div>
        <div>
          <div class="modal-detail-label">Specialty</div>
          <div class="modal-detail-value">${specialty}</div>
        </div>
      </div>
      <div class="modal-detail-row">
        <div class="modal-detail-icon">📞</div>
        <div>
          <div class="modal-detail-label">Phone</div>
          <div class="modal-detail-value">${phone}</div>
        </div>
      </div>
      <div class="modal-detail-row">
        <div class="modal-detail-icon">📍</div>
        <div>
          <div class="modal-detail-label">Address</div>
          <div class="modal-detail-value">${fullAddress}</div>
        </div>
      </div>
      <div class="modal-detail-row">
        <div class="modal-detail-icon">🪪</div>
        <div>
          <div class="modal-detail-label">NPI Number</div>
          <div class="modal-detail-value">${provider.number}</div>
        </div>
      </div>
    </div>
  `;
}

// ── Show a loading spinner ─────────────────────────────────
export function showLoading(el) {
  el.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <span>Loading...</span>
    </div>
  `;
}

// ── Show an error message ──────────────────────────────────
export function showError(el, message) {
  el.innerHTML = `<div class="error">⚠️ ${message}</div>`;
}