// data/dashboardData.js
//
// Fetches dashboard data directly from Supabase via the REST API (no backend).
// Calls the public.get_dashboard_data() RPC function and sets window.DD in the
// shape the rest of the app expects:
//   { countries, districts, schools, years, metrics, data }
//
// Dispatches 'dd:ready' on document when complete (success or failure).

window.DD = null;

(async () => {
  const SUPABASE_URL = 'https://qlvayqyihfixikfqfelu.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_MFmdnO0fxCH-TASV_o77FQ_XeO8SoAk';

  const bar = document.createElement('div');
  bar.id = 'dd-load-bar';
  Object.assign(bar.style, {
    position: 'fixed', top: '0', left: '0', height: '3px', width: '40%',
    background: '#5e2580', zIndex: '99999',
    transition: 'width 0.4s ease',
  });
  document.body.appendChild(bar);
  requestAnimationFrame(() => { bar.style.width = '80%'; });

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_dashboard_data`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: '{}',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `HTTP ${res.status}`);
    }

    const payload = await res.json();
    const rows = payload.data || [];

    // Build DD metadata from the flat rows array
    const countriesSet = new Set();
    const districts    = {};
    const schools      = {};
    const yearsSet     = new Set();
    const metricsSet   = new Set();

    for (const r of rows) {
      if (!r.country) continue;
      countriesSet.add(r.country);
      yearsSet.add(r.year);
      metricsSet.add(r.metric);

      if (!districts[r.country]) districts[r.country] = [];
      if (!districts[r.country].includes(r.district)) districts[r.country].push(r.district);

      if (r.district) {
        if (!schools[r.district]) schools[r.district] = [];
        if (r.school && !schools[r.district].includes(r.school)) schools[r.district].push(r.school);
      }
    }

    window.DD = {
      countries: [...countriesSet].sort(),
      districts,
      schools,
      years:   [...yearsSet].sort((a, b) => a - b),
      metrics: [...metricsSet],
      data:    rows,
    };
  } catch (err) {
    console.error('[CAMFED] Failed to load data from Supabase:', err.message);
    console.warn('[CAMFED] Dynamic Data and Slicer views will be unavailable.');
  }

  bar.style.width = '100%';
  bar.style.transition = 'width 0.2s ease';
  setTimeout(() => bar.remove(), 300);
  document.dispatchEvent(new CustomEvent('dd:ready'));
})();
