/* ── Utilities ──────────────────────────────────── */

/** Clear the children of a DOM element. */
export function clearElement(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
}

/** Show a spinner inside a container. */
export function showLoading(container) {
    clearElement(container);
    const div = document.createElement('div');
    div.className = 'loading-state';
    div.innerHTML = '<div class="spinner"></div><span>Loading…</span>';
    container.appendChild(div);
}

/** Show an error message inside a container. */
export function showError(container, message) {
    clearElement(container);
    const div = document.createElement('div');
    div.className = 'error-state';
    div.textContent = `⚠️ ${message}`;
    container.appendChild(div);
}

/* ── Provider List ──────────────────────────────── */

/**
 * Extract a display name from a provider result object.
 * Handles both individual and organization providers.
 */
function getProviderName(provider) {
    const basic = provider.basic || {};

    if (basic.organization_name) return basic.organization_name;

    const parts = [
        basic.name_prefix,
        basic.first_name,
        basic.middle_name,
        basic.last_name,
        basic.name_suffix,
        basic.credential,
    ].filter(Boolean);

    return parts.join(' ') || 'Unknown Provider';
}

/**
 * Extract city and state from the provider's practice location addresses.
 */
function getProviderLocation(provider) {
    const addresses = provider.addresses || [];
    const practice = addresses.find((a) => a.address_purpose === 'LOCATION') || addresses[0];
    if (!practice) return 'Location unavailable';
    return [practice.city, practice.state].filter(Boolean).join(', ');
}

/**
 * Render a list of providers into a <ul> element.
 * Calls onProviderClick(provider) when a card is clicked.
 * @param {HTMLUListElement} listEl
 * @param {Array} providers
 * @param {Function} onProviderClick
 */
export function renderProviderList(listEl, providers, onProviderClick) {
    clearElement(listEl);

    if (!providers || providers.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No providers found.';
        listEl.appendChild(li);
        return;
    }

    providers.forEach((provider, index) => {
        const name = getProviderName(provider);
        const location = getProviderLocation(provider);
        const npi = provider.number;

        const li = document.createElement('li');

        const card = document.createElement('div');
        card.className = 'provider-card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `View details for ${name}`);
        card.dataset.npi = npi;
        card.style.animationDelay = `${index * 60}ms`;

        card.innerHTML = `
      <div class="provider-avatar" aria-hidden="true">👶</div>
      <div class="provider-info">
        <div class="provider-name">${escapeHtml(name)}</div>
        <div class="provider-location">📍 ${escapeHtml(location)}</div>
      </div>
      <span class="provider-chevron" aria-hidden="true">›</span>
    `;

        const activate = () => {
            // Remove active class from all cards
            listEl.querySelectorAll('.provider-card').forEach((c) => c.classList.remove('active'));
            card.classList.add('active');
            onProviderClick(provider);
        };

        card.addEventListener('click', activate);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activate();
            }
        });

        li.appendChild(card);
        listEl.appendChild(li);
    });
}

/* ── Provider Details ───────────────────────────── */

/**
 * Render detailed provider information into a container div.
 * @param {HTMLDivElement} detailsEl
 * @param {Object} provider
 */
export function renderProviderDetails(detailsEl, provider) {
    clearElement(detailsEl);

    const basic = provider.basic || {};
    const addresses = provider.addresses || [];
    const taxonomies = provider.taxonomies || [];

    // Name & credentials
    const name = getProviderName(provider);
    const credential = basic.credential || '';

    // Practice address
    const practiceAddr = addresses.find((a) => a.address_purpose === 'LOCATION') || addresses[0] || {};
    const addressLine1 = practiceAddr.address_1 || '';
    const addressLine2 = practiceAddr.address_2 || '';
    const city = practiceAddr.city || '';
    const state = practiceAddr.state || '';
    const zip = practiceAddr.postal_code ? practiceAddr.postal_code.slice(0, 5) : '';
    const fullAddress = [
        addressLine1,
        addressLine2,
        [city, state, zip].filter(Boolean).join(', '),
    ].filter(Boolean).join('\n');

    // Phone
    const phone = practiceAddr.telephone_number
        ? formatPhone(practiceAddr.telephone_number)
        : 'Not available';

    // Specialty
    const primaryTaxonomy = taxonomies.find((t) => t.primary) || taxonomies[0] || {};
    const specialty = primaryTaxonomy.desc || 'Pediatrics';
    const taxonomyState = primaryTaxonomy.state ? ` · Licensed in ${primaryTaxonomy.state}` : '';

    // Enrollment date
    const enrolled = basic.enumeration_date
        ? new Date(basic.enumeration_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : null;

    detailsEl.innerHTML = `
    <div class="details-header">
      <div class="details-avatar-lg" aria-hidden="true">🩺</div>
      <div>
        <div class="details-name">${escapeHtml(name)}</div>
        ${credential ? `<div class="details-credential">${escapeHtml(credential)}</div>` : ''}
      </div>
    </div>
    <div class="details-body">
      <div class="detail-row">
        <div class="detail-icon" aria-hidden="true">🏥</div>
        <div class="detail-content">
          <div class="detail-label">Specialty</div>
          <div class="detail-value">${escapeHtml(specialty)}${escapeHtml(taxonomyState)}</div>
        </div>
      </div>
      <div class="detail-row">
        <div class="detail-icon" aria-hidden="true">📞</div>
        <div class="detail-content">
          <div class="detail-label">Phone</div>
          <div class="detail-value">${escapeHtml(phone)}</div>
        </div>
      </div>
      <div class="detail-row">
        <div class="detail-icon" aria-hidden="true">📍</div>
        <div class="detail-content">
          <div class="detail-label">Address</div>
          <div class="detail-value">${escapeHtml(fullAddress).replace(/\n/g, '<br>')}</div>
        </div>
      </div>
      <div class="detail-row">
        <div class="detail-icon" aria-hidden="true">🪪</div>
        <div class="detail-content">
          <div class="detail-label">NPI Number</div>
          <div class="detail-value">${escapeHtml(String(provider.number || 'N/A'))}</div>
        </div>
      </div>
      ${enrolled ? `
      <div class="detail-row">
        <div class="detail-icon" aria-hidden="true">📅</div>
        <div class="detail-content">
          <div class="detail-label">Enrolled Since</div>
          <div class="detail-value">${enrolled}</div>
        </div>
      </div>` : ''}
    </div>
  `;
}

/** Show the empty/placeholder state for the details panel. */
export function renderDetailsPlaceholder(detailsEl) {
    clearElement(detailsEl);
    detailsEl.innerHTML = `
    <div class="details-placeholder">
      <span>👆</span>
      <p>Select a provider from the list<br>to view their details.</p>
    </div>
  `;
}

/* ── Helpers ────────────────────────────────────── */

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function formatPhone(raw) {
    const digits = raw.replace(/\D/g, '');
    if (digits.length === 10) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    return raw;
}