// Escape a value before interpolating it into innerHTML — provider names and
// addresses come from a public, self-reported registry and aren't trustworthy.
function escapeHtml(value) {
  const div = document.createElement('div');
  div.textContent = String(value ?? '');
  return div.innerHTML;
}

// Get provider display name
function getProviderName(provider) {
  const basic = provider.basic;
  if (basic.organization_name) return basic.organization_name;
  const name = [basic.first_name, basic.last_name].filter(Boolean).join(' ');
  return name || 'Unknown Provider';
}

// Get provider city and state
function getProviderLocation(provider) {
  const addresses = provider.addresses;
  const location = addresses.find(a => a.address_purpose === 'LOCATION') || addresses[0];
  if (!location) return 'Location unavailable';
  return `${location.city}, ${location.state}`;
}

// Sort providers by name or city
export function sortProviders(providers, sortBy) {
  const sorted = [...providers];

  sorted.sort((a, b) => {
    if (sortBy === 'city-asc') {
      return getProviderLocation(a).localeCompare(getProviderLocation(b));
    }
    const nameA = getProviderName(a);
    const nameB = getProviderName(b);
    return sortBy === 'name-desc' ? nameB.localeCompare(nameA) : nameA.localeCompare(nameB);
  });

  return sorted;
}

// Render provider cards into the grid
export function renderProviderList(gridEl, providers, onCardClick) {
  gridEl.innerHTML = '';

  if (!providers || providers.length === 0) {
    gridEl.innerHTML = '<p class="error">No providers found. Try a different city or state.</p>';
    return;
  }

  providers.forEach((provider, index) => {
    const name = getProviderName(provider);
    const location = getProviderLocation(provider);

    const card = document.createElement('div');
    card.className = 'provider-card';
    card.style.animationDelay = `${index * 60}ms`;

    card.innerHTML = `
      <div class="card-avatar">👶</div>
      <div class="card-name">${escapeHtml(name)}</div>
      <div class="card-location">📍 ${escapeHtml(location)}</div>
      <div class="card-cta">View Details →</div>
    `;

    card.addEventListener('click', () => onCardClick(provider));
    gridEl.appendChild(card);
  });
}

// Render provider details into the modal
export function renderProviderDetails(modalContentEl, provider) {
  const basic = provider.basic;
  const addresses = provider.addresses;
  const taxonomies = provider.taxonomies;

  const name = getProviderName(provider);
  const credential = basic.credential || '';

  const addr = addresses.find(a => a.address_purpose === 'LOCATION') || addresses[0] || {};
  const street = [addr.address_1, addr.address_2].filter(Boolean).join(', ');
  const cityStateZip = [addr.city, addr.state, addr.postal_code?.slice(0, 5)].filter(Boolean).join(', ');
  const fullAddress = [street, cityStateZip].filter(Boolean).map(escapeHtml).join('<br>') || 'Not available';

  const rawPhone = addr.telephone_number || '';
  const digits = rawPhone.replace(/\D/g, '');
  const phone = digits.length === 10
    ? `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
    : rawPhone || 'Not available';

  const taxonomy = taxonomies.find(t => t.primary) || taxonomies[0] || {};
  const specialty = taxonomy.desc || 'Pediatrics';

  modalContentEl.innerHTML = `
    <div class="modal-header">
      <div class="modal-avatar">🩺</div>
      <div id="modal-provider-name" class="modal-name">${escapeHtml(name)}</div>
      ${credential ? `<div class="modal-credential">${escapeHtml(credential)}</div>` : ''}
    </div>
    <div class="modal-body">
      <div class="modal-detail-row">
        <div class="modal-detail-icon">🏥</div>
        <div>
          <div class="modal-detail-label">Specialty</div>
          <div class="modal-detail-value">${escapeHtml(specialty)}</div>
        </div>
      </div>
      <div class="modal-detail-row">
        <div class="modal-detail-icon">📞</div>
        <div>
          <div class="modal-detail-label">Phone</div>
          <div class="modal-detail-value">${escapeHtml(phone)}</div>
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
          <div class="modal-detail-value">${escapeHtml(provider.number)}</div>
        </div>
      </div>
    </div>
  `;
}

// Append a Save to Favorites button to the modal
export function addFavoriteButton(modalContentEl, provider, onSave) {
  const button = document.createElement('button');
  button.className = 'save-favorite-btn';
  button.textContent = '⭐ Save to Favorites';
  button.addEventListener('click', () => onSave(provider));

  const modalBody = modalContentEl.querySelector('.modal-body');
  if (modalBody) modalBody.appendChild(button);
}

// Append an embedded Google Map to the modal
export function addProviderMap(modalContentEl, provider) {
  const addresses = provider.addresses || [];
  const addr = addresses.find(a => a.address_purpose === 'LOCATION') || addresses[0];

  if (!addr) return;

  const addressString = [
    addr.address_1,
    addr.city,
    addr.state,
    addr.postal_code?.slice(0, 5)
  ].filter(Boolean).join(', ');

  const encodedAddress = encodeURIComponent(addressString);
  const mapUrl = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;

  const mapWrapper = document.createElement('div');
  mapWrapper.className = 'map-wrapper';
  mapWrapper.innerHTML = `
    <p class="map-label">📌 Location</p>
    <iframe
      src="${mapUrl}"
      width="100%"
      height="220"
      style="border:0; border-radius: 12px;"
      allowfullscreen=""
      loading="lazy"
      title="Provider location map"
    ></iframe>
  `;

  const modalBody = modalContentEl.querySelector('.modal-body');
  if (modalBody) modalBody.appendChild(mapWrapper);
}

// Get all favorites from localStorage
export function getFavorites() {
  const stored = localStorage.getItem('pediamap-favorites');
  return stored ? JSON.parse(stored) : [];
}

// Save a provider to localStorage favorites
export function saveFavorite(provider) {
  const favorites = getFavorites();

  const alreadySaved = favorites.some(fav => fav.npi === provider.number);
  if (alreadySaved) {
    alert('This provider is already in your favorites!');
    return;
  }

  const favoriteEntry = {
    npi: provider.number,
    name: getProviderName(provider),
    location: getProviderLocation(provider)
  };

  favorites.push(favoriteEntry);
  localStorage.setItem('pediamap-favorites', JSON.stringify(favorites));
}

// Remove a provider from localStorage favorites by NPI
export function removeFavorite(npi) {
  const favorites = getFavorites();
  const updated = favorites.filter(fav => fav.npi !== npi);
  localStorage.setItem('pediamap-favorites', JSON.stringify(updated));
}

// Render the favorites grid
export function renderFavorites(favoritesGridEl, onRemove) {
  const favorites = getFavorites();
  favoritesGridEl.innerHTML = '';

  if (favorites.length === 0) {
    favoritesGridEl.innerHTML = '<p class="no-favorites">No favorites saved yet. Click a provider and save them!</p>';
    return;
  }

  favorites.forEach(fav => {
    const card = document.createElement('div');
    card.className = 'provider-card favorite-card';

    card.innerHTML = `
      <div class="card-avatar">⭐</div>
      <div class="card-name">${escapeHtml(fav.name)}</div>
      <div class="card-location">📍 ${escapeHtml(fav.location)}</div>
      <button class="remove-btn" data-npi="${escapeHtml(fav.npi)}">Remove</button>
    `;

    card.querySelector('.remove-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      onRemove(fav.npi);
    });

    favoritesGridEl.appendChild(card);
  });
}

// Filter providers by gender and credential type
export function filterProviders(providers, gender, type) {
  return providers.filter(provider => {
    const basic = provider.basic || {};

    const genderMatch = gender === 'all' || (basic.gender || '') === gender;
    const credential = basic.credential || '';
    const typeMatch = type === 'all' || credential.toUpperCase().includes(type);

    return genderMatch && typeMatch;
  });
}

// Show a loading spinner
export function showLoading(el) {
  el.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <span>Loading...</span>
    </div>
  `;
}

// Show an error message
export function showError(el, message) {
  el.innerHTML = `<div class="error">⚠️ ${escapeHtml(message)}</div>`;
}