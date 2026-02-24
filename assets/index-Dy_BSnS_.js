(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function n(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(a){if(a.ep)return;a.ep=!0;const i=n(a);fetch(a.href,i)}})();async function M(e,t){const n=`https://npiregistry.cms.hhs.gov/api/?version=2.1&city=${e}&state=${t}&taxonomy_description=pediatrics&limit=10`,o=`https://corsproxy.io/?${encodeURIComponent(n)}`,a=await fetch(o);if(!a.ok)throw new Error("Could not fetch providers. Please try again.");return(await a.json()).results}async function H(e){const t=`https://npiregistry.cms.hhs.gov/api/?version=2.1&number=${e}`,n=`https://corsproxy.io/?${encodeURIComponent(t)}`,o=await fetch(n);if(!o.ok)throw new Error("Could not fetch provider details. Please try again.");return(await o.json()).results[0]}function y(e){const t=e.basic;return t.organization_name?t.organization_name:[t.first_name,t.last_name].filter(Boolean).join(" ")||"Unknown Provider"}function O(e){const t=e.addresses,n=t.find(o=>o.address_purpose==="LOCATION")||t[0];return n?`${n.city}, ${n.state}`:"Location unavailable"}function h(e,t,n){if(e.innerHTML="",!t||t.length===0){e.innerHTML='<p class="error">No providers found. Try a different city or state.</p>';return}t.forEach((o,a)=>{const i=y(o),r=O(o),s=document.createElement("div");s.className="provider-card",s.style.animationDelay=`${a*60}ms`,s.innerHTML=`
      <div class="card-avatar">👶</div>
      <div class="card-name">${i}</div>
      <div class="card-location">📍 ${r}</div>
      <div class="card-cta">View Details →</div>
    `,s.addEventListener("click",()=>n(o)),e.appendChild(s)})}function x(e,t){const n=t.basic,o=t.addresses,a=t.taxonomies,i=y(t),r=n.credential||"",s=o.find(f=>f.address_purpose==="LOCATION")||o[0]||{},l=[s.address_1,s.address_2].filter(Boolean).join(", "),u=[s.city,s.state,s.postal_code?.slice(0,5)].filter(Boolean).join(", "),F=[l,u].filter(Boolean).join("<br>")||"Not available",C=s.telephone_number||"",v=C.replace(/\D/g,""),_=v.length===10?`(${v.slice(0,3)}) ${v.slice(3,6)}-${v.slice(6)}`:C||"Not available",A=(a.find(f=>f.primary)||a[0]||{}).desc||"Pediatrics";e.innerHTML=`
    <div class="modal-header">
      <div class="modal-avatar">🩺</div>
      <div id="modal-provider-name" class="modal-name">${i}</div>
      ${r?`<div class="modal-credential">${r}</div>`:""}
    </div>
    <div class="modal-body">
      <div class="modal-detail-row">
        <div class="modal-detail-icon">🏥</div>
        <div>
          <div class="modal-detail-label">Specialty</div>
          <div class="modal-detail-value">${A}</div>
        </div>
      </div>
      <div class="modal-detail-row">
        <div class="modal-detail-icon">📞</div>
        <div>
          <div class="modal-detail-label">Phone</div>
          <div class="modal-detail-value">${_}</div>
        </div>
      </div>
      <div class="modal-detail-row">
        <div class="modal-detail-icon">📍</div>
        <div>
          <div class="modal-detail-label">Address</div>
          <div class="modal-detail-value">${F}</div>
        </div>
      </div>
      <div class="modal-detail-row">
        <div class="modal-detail-icon">🪪</div>
        <div>
          <div class="modal-detail-label">NPI Number</div>
          <div class="modal-detail-value">${t.number}</div>
        </div>
      </div>
    </div>
  `}function D(e,t,n){const o=document.createElement("button");o.className="save-favorite-btn",o.textContent="⭐ Save to Favorites",o.addEventListener("click",()=>n(t));const a=e.querySelector(".modal-body");a&&a.appendChild(o)}function U(e,t){const n=t.addresses||[],o=n.find(u=>u.address_purpose==="LOCATION")||n[0];if(!o)return;const a=[o.address_1,o.city,o.state,o.postal_code?.slice(0,5)].filter(Boolean).join(", "),r=`https://www.google.com/maps?q=${encodeURIComponent(a)}&output=embed`,s=document.createElement("div");s.className="map-wrapper",s.innerHTML=`
    <p class="map-label">📌 Location</p>
    <iframe
      src="${r}"
      width="100%"
      height="220"
      style="border:0; border-radius: 12px;"
      allowfullscreen=""
      loading="lazy"
      title="Provider location map"
    ></iframe>
  `;const l=e.querySelector(".modal-body");l&&l.appendChild(s)}function g(){const e=localStorage.getItem("pediamap-favorites");return e?JSON.parse(e):[]}function j(e){const t=g();if(t.some(a=>a.npi===e.number)){alert("This provider is already in your favorites!");return}const o={npi:e.number,name:y(e),location:O(e)};t.push(o),localStorage.setItem("pediamap-favorites",JSON.stringify(t))}function k(e){const n=g().filter(o=>o.npi!==e);localStorage.setItem("pediamap-favorites",JSON.stringify(n))}function b(e,t){const n=g();if(e.innerHTML="",n.length===0){e.innerHTML='<p class="no-favorites">No favorites saved yet. Click a provider and save them!</p>';return}n.forEach(o=>{const a=document.createElement("div");a.className="provider-card favorite-card",a.innerHTML=`
      <div class="card-avatar">⭐</div>
      <div class="card-name">${o.name}</div>
      <div class="card-location">📍 ${o.location}</div>
      <button class="remove-btn" data-npi="${o.npi}">Remove</button>
    `,a.querySelector(".remove-btn").addEventListener("click",i=>{i.stopPropagation(),t(o.npi)}),e.appendChild(a)})}function q(e,t,n){return e.filter(o=>{const a=o.basic||{},i=t==="all"||(a.gender||"")===t,r=a.credential||"",s=n==="all"||r.toUpperCase().includes(n);return i&&s})}function L(e){e.innerHTML=`
    <div class="loading">
      <div class="spinner"></div>
      <span>Loading...</span>
    </div>
  `}function w(e,t){e.innerHTML=`<div class="error">⚠️ ${t}</div>`}const d=document.getElementById("provider-grid"),E=document.getElementById("favorites-grid"),p=document.getElementById("search-form"),m=document.getElementById("modal-overlay"),R=document.getElementById("modal-close-btn"),c=document.getElementById("modal-content"),$=document.getElementById("gender-filter"),P=document.getElementById("type-filter");let N=[];function z(){m.removeAttribute("hidden"),document.body.style.overflow="hidden"}function I(){m.setAttribute("hidden",""),document.body.style.overflow="",c.innerHTML=""}R.addEventListener("click",I);m.addEventListener("click",e=>{e.target===m&&I()});document.addEventListener("keydown",e=>{e.key==="Escape"&&I()});function J(e){j(e),b(E,S)}function S(e){k(e),b(E,S)}function T(){const e=$.value,t=P.value,n=q(N,e,t);h(d,n,B)}$.addEventListener("change",T);P.addEventListener("change",T);async function B(e){L(c),z();try{const t=await H(e.number);x(c,t),U(c,t),D(c,t,J)}catch(t){w(c,t.message)}}async function K(e){e.preventDefault();const t=new FormData(p),n=t.get("city"),o=t.get("state");p.reset(),$.value="all",P.value="all",L(d);try{const a=await M(n,o);N=a,h(d,a,B)}catch(a){w(d,a.message)}}async function V(){L(d),b(E,S);try{const e=await M("Boston","MA");N=e,h(d,e,B)}catch(e){w(d,e.message)}}p.addEventListener("submit",K);V();
