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
    // ── Main dashboard RPC ──────────────────────────────────────────────────────
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

    // ── KPI 1.3: Total Girls / Boys supported (direct from view_observed_kpi) ──
    const kpi13Res = await fetch(
      `${SUPABASE_URL}/rest/v1/view_observed_kpi` +
      `?select=country,disaggregation_level_two,year,value` +
      `&kpi_id=eq.1.3` +
      `&disaggregation_level_two=in.(Girls,Boys)`,
      {
        headers: {
          'apikey':         SUPABASE_ANON_KEY,
          'Authorization':  `Bearer ${SUPABASE_ANON_KEY}`,
          'Accept-Profile': 'rep_warehouse',
        },
      }
    );
    window.DD_KPI13 = [];
    if (kpi13Res.ok) {
      const kpi13Rows = await kpi13Res.json();
      window.DD_KPI13 = kpi13Rows.map(r => ({
        country: r.country,
        gender:  r.disaggregation_level_two,
        year:    +r.year,
        value:   parseFloat(r.value) || 0,
      }));
    } else {
      console.warn('[CAMFED] KPI 1.3 fetch failed:', kpi13Res.status);
    }

    // ── KPI P18: MoU counts per country ────────────────────────────────────────
    const mouRes = await fetch(
      `${SUPABASE_URL}/rest/v1/view_observed_kpi?select=country,value&kpi_id=eq.P18`,
      {
        headers: {
          'apikey':         SUPABASE_ANON_KEY,
          'Authorization':  `Bearer ${SUPABASE_ANON_KEY}`,
          'Accept-Profile': 'rep_warehouse',
        },
      }
    );
    window.DD_MOU = {};
    if (mouRes.ok) {
      const mouRows = await mouRes.json();
      mouRows.forEach(r => {
        if (!r.country) return;
        window.DD_MOU[r.country] = (window.DD_MOU[r.country] || 0) + (parseFloat(r.value) || 0);
      });
    } else {
      console.warn('[CAMFED] KPI P18 (MoU) fetch failed:', mouRes.status);
    }

    // ── KPI 3.5: Children Benefitting from Improved Learning Environment ────────
    const kpi35Res = await fetch(
      `${SUPABASE_URL}/rest/v1/view_observed_kpi` +
      `?select=country,disaggregation_level_one,disaggregation_level_two,year,value&kpi_id=eq.3.5`,
      {
        headers: {
          'apikey':         SUPABASE_ANON_KEY,
          'Authorization':  `Bearer ${SUPABASE_ANON_KEY}`,
          'Accept-Profile': 'rep_warehouse',
        },
      }
    );
    window.DD_KPI35 = [];
    if (kpi35Res.ok) {
      window.DD_KPI35 = (await kpi35Res.json()).map(r => ({
        country: r.country,
        toggle:  r.disaggregation_level_one,
        subtype: r.disaggregation_level_two,
        year:    +r.year,
        value:   parseFloat(r.value) || 0,
      }));
    } else {
      console.warn('[CAMFED] KPI 3.5 fetch failed:', kpi35Res.status);
    }

    // ── Community Champions: CDCs, SBCs, PSGs by country (kpi_id P6) ──────────
    const champRes = await fetch(
      `${SUPABASE_URL}/rest/v1/view_observed_kpi` +
      `?select=country,disaggregation_level_one,year,value&kpi_id=eq.P6&disaggregation_level_two=eq.Members&disaggregation_level_one=in.(CDCs,SBCs,PSGs)`,
      {
        headers: {
          'apikey':         SUPABASE_ANON_KEY,
          'Authorization':  `Bearer ${SUPABASE_ANON_KEY}`,
          'Accept-Profile': 'rep_warehouse',
        },
      }
    );
    window.DD_CHAMPIONS = [];
    if (champRes.ok) {
      window.DD_CHAMPIONS = (await champRes.json()).map(r => ({
        country: r.country,
        type:    r.disaggregation_level_one,
        year:    +r.year,
        value:   parseFloat(r.value) || 0,
      }));
    } else {
      console.warn('[CAMFED] Champions fetch failed:', champRes.status);
    }

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
