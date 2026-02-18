// Helper: get a provider's display name
function getProviderName(provider) {
  const basic = provider.basic;

  if (basic.organization_name) {
    return basic.organization_name;
  }


  const name = [basic.first_name, basic.last_name].filter(Boolean).join(' ');
  return name || 'Unknown Provider';
}

// Helper: get a provider's city and state 
function getProviderLocation(provider) {
  const addresses = provider.addresses;

  // Precise location
  const location = addresses.find(a => a.address_purpose === 'LOCATION') || addresses[0];

  if (!location) return 'Location unavailable';
  return `${location.city}, ${location.state}`;
}

// ── Render the list of providers into the <ul> 
// onCardClick is a function we pass in from main.js that runs when a card is clicked
export function renderProviderList(listEl, providers, onCardClick) {
  // Clear anything already in the list
  listEl.innerHTML = '';

  if (!providers || providers.length === 0) {
    listEl.innerHTML = '<li>No providers found.</li>';
    return;
  }

  // Create one list item per provider
  providers.forEach(provider => {
    const name = getProviderName(provider);
    const location = getProviderLocation(provider);

    const li = document.createElement('li');
    li.innerHTML = `
      <div class="provider-card">
        <div class="provider-avatar">👶</div>
        <div>
          <div class="provider-name">${name}</div>
          <div class="provider-location">📍 ${location}</div>
        </div>
      </div>
    `;

    // When this card is clicked, highlight it and trigger the callback
    const card = li.querySelector('.provider-card');
    card.addEventListener('click', () => {
      // Remove 'active' from any previously selected card
      document.querySelectorAll('.provider-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      // Tell main.js that this provider was clicked
      onCardClick(provider);
    });

    listEl.appendChild(li);
  });
}

// ── Render detailed info for one provider ─────────────────
export function renderProviderDetails(detailsEl, provider) {
  const basic = provider.basic;
  const addresses = provider.addresses;
  const taxonomies = provider.taxonomies;

  // Get the name and optional credential (e.g. "MD", "DO")
  const name = getProviderName(provider);
  const credential = basic.credential || '';

  // Get the practice address
  const addr = addresses.find(a => a.address_purpose === 'LOCATION') || addresses[0] || {};
  const street = [addr.address_1, addr.address_2].filter(Boolean).join(', ');
  const cityStateZip = [addr.city, addr.state, addr.postal_code?.slice(0, 5)].filter(Boolean).join(', ');
  const fullAddress = [street, cityStateZip].filter(Boolean).join('<br>');

  // Format the phone number nicely (e.g. "6175551234" → "(617) 555-1234")
  const rawPhone = addr.telephone_number || '';
  const digits = rawPhone.replace(/\D/g, '');
  const phone = digits.length === 10
    ? `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
    : rawPhone || 'Not available';

  // Get the primary specialty
  const taxonomy = taxonomies.find(t => t.primary) || taxonomies[0] || {};
  const specialty = taxonomy.desc || 'Pediatrics';

  // Build the HTML for the details panel
  detailsEl.innerHTML = `
    <div class="details-header">
      <div class="details-name">🩺 ${name}</div>
      ${credential ? `<div class="details-credential">${credential}</div>` : ''}
    </div>
    <div class="details-body">
      <div class="detail-row">
        <div class="detail-icon">🏥</div>
        <div>
          <div class="detail-label">Specialty</div>
          <div class="detail-value">${specialty}</div>
        </div>
      </div>
      <div class="detail-row">
        <div class="detail-icon">📞</div>
        <div>
          <div class="detail-label">Phone</div>
          <div class="detail-value">${phone}</div>
        </div>
      </div>
      <div class="detail-row">
        <div class="detail-icon">📍</div>
        <div>
          <div class="detail-label">Address</div>
          <div class="detail-value">${fullAddress || 'Not available'}</div>
        </div>
      </div>
      <div class="detail-row">
        <div class="detail-icon">🪪</div>
        <div>
          <div class="detail-label">NPI Number</div>
          <div class="detail-value">${provider.number}</div>
        </div>
      </div>
    </div>
  `;
}

// Show a "select a provider" placeholder 
export function renderDetailsPlaceholder(detailsEl) {
  detailsEl.innerHTML = `
    <div class="placeholder">
      <span>👆</span>
      <p>Select a provider to see their details.</p>
    </div>
  `;
}

// Show a loading message 
export function showLoading(el, message = 'Loading...') {
  el.innerHTML = `<div class="loading">${message}</div>`;
}

// Show an error message 
export function showError(el, message) {
  el.innerHTML = `<div class="error">⚠️ ${message}</div>`;
}