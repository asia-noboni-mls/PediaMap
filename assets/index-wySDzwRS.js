(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function n(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(o){if(o.ep)return;o.ep=!0;const i=n(o);fetch(o.href,i)}})();const D=[e=>`https://api.allorigins.win/raw?url=${encodeURIComponent(e)}`,e=>`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(e)}`],j=8e3;async function k(e){const t=new AbortController,n=setTimeout(()=>t.abort(),j);try{return await fetch(e,{signal:t.signal})}finally{clearTimeout(n)}}async function A(e){for(const t of D)try{const n=await k(t(e));if(!n.ok)throw new Error(`Proxy responded with ${n.status}`);return await n.json()}catch{}throw new Error("Could not reach the provider directory. Please try again in a moment.")}async function H(e,t){const n=`https://npiregistry.cms.hhs.gov/api/?version=2.1&city=${encodeURIComponent(e)}&state=${encodeURIComponent(t)}&taxonomy_description=pediatrics&limit=10`;return(await A(n)).results||[]}async function q(e){const t=`https://npiregistry.cms.hhs.gov/api/?version=2.1&number=${e}`,n=await A(t);if(!n.results||!n.results[0])throw new Error("Provider details not found.");return n.results[0]}function d(e){const t=document.createElement("div");return t.textContent=String(e??""),t.innerHTML}function m(e){const t=e.basic;return t.organization_name?t.organization_name:[t.first_name,t.last_name].filter(Boolean).join(" ")||"Unknown Provider"}function p(e){const t=e.addresses,n=t.find(a=>a.address_purpose==="LOCATION")||t[0];return n?`${n.city}, ${n.state}`:"Location unavailable"}function w(e,t){const n=[...e];return n.sort((a,o)=>{if(t==="city-asc")return p(a).localeCompare(p(o));const i=m(a),s=m(o);return t==="name-desc"?s.localeCompare(i):i.localeCompare(s)}),n}function E(e,t,n){if(e.innerHTML="",!t||t.length===0){e.innerHTML='<p class="error">No providers found. Try a different city or state.</p>';return}t.forEach((a,o)=>{const i=m(a),s=p(a),r=document.createElement("div");r.className="provider-card",r.style.animationDelay=`${o*60}ms`,r.innerHTML=`
      <div class="card-avatar">👶</div>
      <div class="card-name">${d(i)}</div>
      <div class="card-location">📍 ${d(s)}</div>
      <div class="card-cta">View Details →</div>
    `,r.addEventListener("click",()=>n(a)),e.appendChild(r)})}function z(e,t){const n=t.basic,a=t.addresses,o=t.taxonomies,i=m(t),s=n.credential||"",r=a.find(g=>g.address_purpose==="LOCATION")||a[0]||{},u=[r.address_1,r.address_2].filter(Boolean).join(", "),h=[r.city,r.state,r.postal_code?.slice(0,5)].filter(Boolean).join(", "),U=[u,h].filter(Boolean).map(d).join("<br>")||"Not available",F=r.telephone_number||"",f=F.replace(/\D/g,""),x=f.length===10?`(${f.slice(0,3)}) ${f.slice(3,6)}-${f.slice(6)}`:F||"Not available",R=(o.find(g=>g.primary)||o[0]||{}).desc||"Pediatrics";e.innerHTML=`
    <div class="modal-header">
      <div class="modal-avatar">🩺</div>
      <div id="modal-provider-name" class="modal-name">${d(i)}</div>
      ${s?`<div class="modal-credential">${d(s)}</div>`:""}
    </div>
    <div class="modal-body">
      <div class="modal-detail-row">
        <div class="modal-detail-icon">🏥</div>
        <div>
          <div class="modal-detail-label">Specialty</div>
          <div class="modal-detail-value">${d(R)}</div>
        </div>
      </div>
      <div class="modal-detail-row">
        <div class="modal-detail-icon">📞</div>
        <div>
          <div class="modal-detail-label">Phone</div>
          <div class="modal-detail-value">${d(x)}</div>
        </div>
      </div>
      <div class="modal-detail-row">
        <div class="modal-detail-icon">📍</div>
        <div>
          <div class="modal-detail-label">Address</div>
          <div class="modal-detail-value">${U}</div>
        </div>
      </div>
      <div class="modal-detail-row">
        <div class="modal-detail-icon">🪪</div>
        <div>
          <div class="modal-detail-label">NPI Number</div>
          <div class="modal-detail-value">${d(t.number)}</div>
        </div>
      </div>
    </div>
  `}function J(e,t,n){const a=document.createElement("button");a.className="save-favorite-btn",a.textContent="⭐ Save to Favorites",a.addEventListener("click",()=>n(t));const o=e.querySelector(".modal-body");o&&o.appendChild(a)}function W(e,t){const n=t.addresses||[],a=n.find(h=>h.address_purpose==="LOCATION")||n[0];if(!a)return;const o=[a.address_1,a.city,a.state,a.postal_code?.slice(0,5)].filter(Boolean).join(", "),s=`https://www.google.com/maps?q=${encodeURIComponent(o)}&output=embed`,r=document.createElement("div");r.className="map-wrapper",r.innerHTML=`
    <p class="map-label">📌 Location</p>
    <iframe
      src="${s}"
      width="100%"
      height="220"
      style="border:0; border-radius: 12px;"
      allowfullscreen=""
      loading="lazy"
      title="Provider location map"
    ></iframe>
  `;const u=e.querySelector(".modal-body");u&&u.appendChild(r)}function L(){const e=localStorage.getItem("pediamap-favorites");return e?JSON.parse(e):[]}function K(e){const t=L();if(t.some(o=>o.npi===e.number)){alert("This provider is already in your favorites!");return}const a={npi:e.number,name:m(e),location:p(e)};t.push(a),localStorage.setItem("pediamap-favorites",JSON.stringify(t))}function Q(e){const n=L().filter(a=>a.npi!==e);localStorage.setItem("pediamap-favorites",JSON.stringify(n))}function P(e,t){const n=L();if(e.innerHTML="",n.length===0){e.innerHTML='<p class="no-favorites">No favorites saved yet. Click a provider and save them!</p>';return}n.forEach(a=>{const o=document.createElement("div");o.className="provider-card favorite-card",o.innerHTML=`
      <div class="card-avatar">⭐</div>
      <div class="card-name">${d(a.name)}</div>
      <div class="card-location">📍 ${d(a.location)}</div>
      <button class="remove-btn" data-npi="${d(a.npi)}">Remove</button>
    `,o.querySelector(".remove-btn").addEventListener("click",i=>{i.stopPropagation(),t(a.npi)}),e.appendChild(o)})}function V(e,t,n){return e.filter(a=>{const o=a.basic||{},i=t==="all"||(o.gender||"")===t,s=o.credential||"",r=n==="all"||s.toUpperCase().includes(n);return i&&r})}function $(e){e.innerHTML=`
    <div class="loading">
      <div class="spinner"></div>
      <span>Loading...</span>
    </div>
  `}function C(e,t){e.innerHTML=`<div class="error">⚠️ ${d(t)}</div>`}const c=document.getElementById("provider-grid"),I=document.getElementById("favorites-grid"),b=document.getElementById("search-form"),y=document.getElementById("modal-overlay"),X=document.getElementById("modal-close-btn"),l=document.getElementById("modal-content"),S=document.getElementById("gender-filter"),T=document.getElementById("type-filter"),v=document.getElementById("sort-filter");let M=[];function Z(){y.removeAttribute("hidden"),document.body.style.overflow="hidden"}function N(){y.setAttribute("hidden",""),document.body.style.overflow="",l.innerHTML=""}X.addEventListener("click",N);y.addEventListener("click",e=>{e.target===y&&N()});document.addEventListener("keydown",e=>{e.key==="Escape"&&N()});function G(e){K(e),P(I,B)}function B(e){Q(e),P(I,B)}function O(){const e=S.value,t=T.value,n=V(M,e,t),a=w(n,v.value);E(c,a,_)}S.addEventListener("change",O);T.addEventListener("change",O);v.addEventListener("change",O);async function _(e){$(l),Z();try{const t=await q(e.number);z(l,t),W(l,t),J(l,t,G)}catch(t){C(l,t.message)}}async function Y(e){e.preventDefault();const t=new FormData(b),n=t.get("city"),a=t.get("state");b.reset(),S.value="all",T.value="all",v.value="name-asc",$(c);try{const o=await H(n,a);M=o,E(c,w(o,v.value),_)}catch(o){C(c,o.message)}}async function ee(){$(c),P(I,B);try{const e=await H("Boston","MA");M=e,E(c,w(e,v.value),_)}catch(e){C(c,e.message)}}b.addEventListener("submit",Y);ee();
