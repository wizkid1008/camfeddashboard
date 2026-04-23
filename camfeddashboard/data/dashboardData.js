// data/dashboardData.js
//
// Fetches dashboard data from the CAMFED backend API and sets window.DD
// in the same shape the rest of the app expects:
//   { countries, districts, schools, years, metrics, data }
//
// Dispatches 'dd:ready' on document when complete (success or failure).

window.DD = null;

(async () => {
  // Relative URL works because the dashboard is served by the same Express server as the API
  const API_BASE = '';

  // Show a non-blocking loading bar at the top of the page
  const bar = document.createElement('div');
  bar.id = 'dd-load-bar';
  Object.assign(bar.style, {
    position: 'fixed', top: '0', left: '0', height: '3px', width: '40%',
    background: '#5e2580', zIndex: '99999',
    transition: 'width 0.4s ease',
  });
  document.body.appendChild(bar);

  // Animate bar to ~80% while waiting
  requestAnimationFrame(() => { bar.style.width = '80%'; });

  try {
    const res = await fetch(`${API_BASE}/api/data`);
    if (!res.ok) throw new Error(`API responded with HTTP ${res.status}`);
    window.DD = await res.json();
  } catch (err) {
    console.error('[CAMFED] Failed to load data from API:', err.message);
    console.warn('[CAMFED] Dynamic Data and Slicer views will be unavailable.');
  }

  // Complete and remove bar
  bar.style.width = '100%';
  bar.style.transition = 'width 0.2s ease';
  setTimeout(() => bar.remove(), 300);

  document.dispatchEvent(new CustomEvent('dd:ready'));
})();
