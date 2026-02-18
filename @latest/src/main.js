import { fetchProviders, fetchProviderDetails } from "./fetch-helpers.js";
import { 
  renderProviderList,
  renderProviderDetails,
  renderDetailsPlaceholder,
  showLoading,
  showError, } from './dom-helpers.js'

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
import "./style.css";
import javascriptLogo from "./javascript.svg";
import viteLogo from "/vite.svg";
import { setupCounter } from "./counter.js";

document.querySelector("#app").innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`;

setupCounter(document.querySelector("#counter"));

const searchForm = document.querySelector("#search-form");

searchForm.addEventListener("submit", (event) => {
  event.preventDefault(); // 🚫 stop page reload

  const formData = new FormData(searchForm);
  const city = formData.get("city");

  console.log("City entered:", city);

  searchForm.reset(); // clears the input
});
