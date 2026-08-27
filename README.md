# PediaMap | Find Pediatric Providers

## Project Summary
PediaMap is an interactive web application that helps users find pediatric healthcare providers in the U.S. Users can search by city, view a list of providers, and see detailed information about each provider. The app is designed with a clean, responsive, and child-friendly UI.

---

## Live Link
https://asia-noboni-mls.github.io/pediaMap/

---

## Team Members
- **Asia Idrees** – Frontend, API integration, UI design  
- **Noboni Sultan** – Backend logic, fetch functions, single-item rendering  

---

## API Used
**NPI Registry API (CMS)**  
- **Collection Endpoint (fetch multiple providers):**  
`https://npiregistry.cms.hhs.gov/api/?version=2.1&city=Boston&state=MA&taxonomy_description=pediatrics&limit=10`  
- **Single Provider Endpoint (fetch details):**  
`https://npiregistry.cms.hhs.gov/api/?version=2.1&number={npiNumber}`

---

## Features

### MVP
- Search pediatric providers by city
- Display a list of providers with name and location
- Click on a provider to view detailed info (address, phone, credentials)
- Semantic HTML with accessible structure
- Mobile-first responsive design

### Stretch Features
- Save favorite providers to localStorage
- Filter/search persistence on reload
- Cute, child-friendly UI theme

---

## Setup Instructions
1. Clone the repository:  
   ```bash
   git clone git@github.com:asia-noboni-mls/pediaMap.git
Install dependencies:

npm install
Run the development server:

npm run dev
Open your browser to the local dev server URL

