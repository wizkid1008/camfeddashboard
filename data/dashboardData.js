// data/dashboardData.js
//
// Fetches dashboard data from Supabase via a single RPC call to
// get_dashboard_data() which reads from a pre-computed materialized view.
// Sets window.DD: { countries, districts, schools, years, metrics, data }
// Dispatches 'dd:ready' on document when complete.

window.DD = null;

(async () => {
  const SUPABASE_URL      = 'https://qlvayqyihfixikfqfelu.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_MFmdnO0fxCH-TASV_o77FQ_XeO8SoAk';

  const bar = document.createElement('div');
  bar.id = 'dd-load-bar';
  Object.assign(bar.style, {
    position: 'fixed', top: '0', left: '0', height: '3px', width: '40%',
    background: '#5e2580', zIndex: '99999', transition: 'width 0.4s ease',
  });
  document.body.appendChild(bar);
  requestAnimationFrame(() => { bar.style.width = '80%'; });

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_dashboard_data`, {
      method: 'POST',
      headers: {
        'apikey':        SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type':  'application/json',
      },
      body: '{}',
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e.message || `HTTP ${res.status}`);
    }

    const payload = await res.json();
    const rows = payload.data || [];

    const countriesSet  = new Set();
    const districts     = {};
    const schools       = {};
    const yearsSet      = new Set();
    const metricsSet    = new Set();
    const metricTypes   = {}; // metric name → value_type string

    for (const r of rows) {
      if (!r.country) continue;
      countriesSet.add(r.country);
      yearsSet.add(r.year);
      metricsSet.add(r.metric);
      if (r.metric && r.value_type && !metricTypes[r.metric]) {
        metricTypes[r.metric] = r.value_type;
      }
      if (!districts[r.country]) districts[r.country] = [];
      if (!districts[r.country].includes(r.district)) districts[r.country].push(r.district);
      if (r.district) {
        if (!schools[r.district]) schools[r.district] = [];
        if (r.school && !schools[r.district].includes(r.school)) schools[r.district].push(r.school);
      }
    }

    window.DD = {
      countries:   [...countriesSet].sort(),
      districts,
      schools,
      years:       [...yearsSet].sort((a, b) => a - b),
      metrics:     [...metricsSet],
      metricTypes, // metric → 'Count' | 'Percentage' | 'Currency (USD)' | 'Currency (local)' | 'Text'
      data:        rows,
    };
  } catch (err) {
    console.error('[CAMFED] Failed to load data from Supabase:', err.message);
  }

  bar.style.width = '100%';
  bar.style.transition = 'width 0.2s ease';
  setTimeout(() => bar.remove(), 300);
  document.dispatchEvent(new CustomEvent('dd:ready'));
})();
