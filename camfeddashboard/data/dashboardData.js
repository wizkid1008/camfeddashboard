// data/dashboardData.js
//
// Fetches dashboard data from Supabase via a single RPC call to
// get_dashboard_data() which reads from a pre-computed materialized view.
// Sets window.DD: { countries, districts, schools, years, metrics, data }
// Sets window.KPI_MAPPING: rows from public.kpi_mapping for Education Reach
// Sets window.DD_ER: raw view_observed_kpi rows for Education Reach kpi_ids
// Dispatches 'dd:ready' on document when complete.

window.DD         = null;
window.KPI_MAPPING = [];
window.DD_ER      = [];

(async () => {
  const SUPABASE_URL      = 'https://qlvayqyihfixikfqfelu.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_MFmdnO0fxCH-TASV_o77FQ_XeO8SoAk';

  const hdr = {
    'apikey':        SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  };
  const whHdr = { ...hdr, 'Accept-Profile': 'rep_warehouse' };

  const bar = document.createElement('div');
  bar.id = 'dd-load-bar';
  Object.assign(bar.style, {
    position: 'fixed', top: '0', left: '0', height: '3px', width: '40%',
    background: '#5e2580', zIndex: '99999', transition: 'width 0.4s ease',
  });
  document.body.appendChild(bar);
  requestAnimationFrame(() => { bar.style.width = '80%'; });

  try {
    // ── 1. Main dashboard RPC ─────────────────────────────────────────────────
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_dashboard_data`, {
      method: 'POST',
      headers: { ...hdr, 'Content-Type': 'application/json' },
      body: '{}',
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e.message || `HTTP ${res.status}`);
    }

    const payload = await res.json();
    const rows = payload.data || [];

    // ── 2. KPI mapping for Education Reach ───────────────────────────────────
    const mappingRes = await fetch(
      `${SUPABASE_URL}/rest/v1/kpi_mapping` +
      `?dashboard_page=eq.Girls+Education%3A+Education+Reach` +
      `&select=dashlet_element,kpi_id,disaggregation_level_one,disaggregation_level_two,data_element,toggle`,
      { headers: hdr }
    );
    if (mappingRes.ok) {
      window.KPI_MAPPING = await mappingRes.json();
    } else {
      console.warn('[CAMFED] kpi_mapping fetch failed:', mappingRes.status);
    }

    // ── 3. Raw Education Reach data from view_observed_kpi ───────────────────
    // Fetch all rows for kpi_ids used in Education Reach (1.1, 1.2a, 1.3).
    // erQ() in script.js filters this further using the mapping.
    const erRes = await fetch(
      `${SUPABASE_URL}/rest/v1/view_observed_kpi` +
      `?select=country,kpi_id,disaggregation_level_one,disaggregation_level_two,year,value` +
      `&kpi_id=in.(1.1,1.2a,1.3)`,
      { headers: whHdr }
    );
    if (erRes.ok) {
      const erRaw = await erRes.json();
      window.DD_ER = erRaw.map(r => ({
        country: r.country,
        kpiId:   r.kpi_id,
        l1:      r.disaggregation_level_one,
        l2:      r.disaggregation_level_two,
        year:    +r.year,
        value:   parseFloat(r.value) || 0,
      }));
    } else {
      console.warn('[CAMFED] DD_ER fetch failed:', erRes.status);
    }

    // ── 4. Build DD object ────────────────────────────────────────────────────
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
  }

  bar.style.width = '100%';
  bar.style.transition = 'width 0.2s ease';
  setTimeout(() => bar.remove(), 300);
  document.dispatchEvent(new CustomEvent('dd:ready'));
})();
