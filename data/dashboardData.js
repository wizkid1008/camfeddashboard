// data/dashboardData.js
//
// Fetches dashboard data directly from Supabase via 10 parallel RPC calls.
// Sets window.DD in the shape the rest of the app expects:
//   { countries, districts, schools, years, metrics, data }
// Dispatches 'dd:ready' on document when complete (success or failure).

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

  const METRICS = [
    { fn: 'get_dd_children_bursaries',  label: 'Children Supported in School with Education Bursaries' },
    { fn: 'get_dd_learner_guides',       label: 'Active Learner Guides' },
    { fn: 'get_dd_clients_by_form',      label: 'Number of Clients by Form' },
    { fn: 'get_dd_partner_schools',      label: 'Active Partner Schools' },
    { fn: 'get_dd_tertiary_education',   label: 'Women Supported in Tertiary Education' },
    { fn: 'get_dd_guides_by_type',       label: 'Active Guides by Type' },
    { fn: 'get_dd_post_school_clients',  label: 'Number of Post School Clients' },
    { fn: 'get_dd_grants',               label: 'Grants Disbursed' },
    { fn: 'get_dd_loans',                label: 'Loans Disbursed' },
    { fn: 'get_dd_cama_members',         label: 'CAMA Members' },
  ];

  const headers = {
    'apikey':        SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type':  'application/json',
  };

  async function callRpc(fn) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
      method: 'POST', headers, body: '{}',
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(`${fn}: ${e.message || res.status}`);
    }
    return res.json();
  }

  try {
    // Fire all 10 requests in parallel
    const results = await Promise.all(METRICS.map(m => callRpc(m.fn)));

    const data = [];
    for (let i = 0; i < METRICS.length; i++) {
      const rows = results[i] || [];
      for (const r of rows) {
        data.push({ ...r, metric: METRICS[i].label });
      }
    }

    // Build DD metadata
    const countriesSet = new Set();
    const districts    = {};
    const schools      = {};
    const yearsSet     = new Set();
    const metricsSet   = new Set();

    for (const r of data) {
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
      data,
    };
  } catch (err) {
    console.error('[CAMFED] Failed to load data from Supabase:', err.message);
  }

  bar.style.width = '100%';
  bar.style.transition = 'width 0.2s ease';
  setTimeout(() => bar.remove(), 300);
  document.dispatchEvent(new CustomEvent('dd:ready'));
})();
