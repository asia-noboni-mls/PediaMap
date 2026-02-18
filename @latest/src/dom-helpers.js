//get providers city and state
function getProviderLocation(provider) {
  const addresses = provider.addresses;

  // since the Api can return mulptiple addresses - we want the practice location
  const location =
    addresses?.find((a) => a.addresses_purposes === "LOCATION") ||
    addresses?.[0];

  if (!location) return "Location unavailable";
  return `${location.city}, ${location.state}`;
}

//rendering the list of providers into the <ul>
// onCardClick is a function we pass in from the main.js that runs when the card is clicked
export function renderProviderList(listEl, providers, onCardClick) {
  //clear anytihng in the list
  listEl.innerHTML = "";

  if (!providers || providers.length === 0) {
    listEl.innerHTML = "<li>No providers found>/li>";
    return;
  }
  // Create one list item per provider
  providers.forEach((provider) => {
    const name = getProviderName(provider);
    const location = getProviderLocation(provider);

    const li = document.createElement("li");

    li.innerHTML = `
<div class="provider-card">
<div class="provider-avatar">👶</div>
<div>
<div class="provider-name">${name}</div>
<div class="provider-location">📍 ${location}</div>
</div>
</div>
`;

    const card = li.querySelector(".provider-card");

    card.addEventListener("click", () => {
      // Remove 'active' from any previously selected card
      document
        .querySelectorAll(".provider-card")
        .forEach((c) => c.classList.remove("active"));

      card.classList.add("active");

      // Tell main.js that this provider was clicked
      onCardClick(provider);
    });

    listEl.appendChild(li);
  });
}
