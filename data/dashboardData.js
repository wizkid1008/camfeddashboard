// data/dashboardData.js
//
// Static, deterministic data file for the CAMFED dashboard.
// No Math.random() — all values come from fixed formulas so the output is
// identical on every page load.
//
// Usage (plain <script> tag, before script.js):
//   <script src="data/dashboardData.js"></script>
//
// Exposes a single global:  window.DD
// Destructure what you need:
//   const { countries, districts, schools, years, metrics, data } = DD;

const DD = (() => {

  // ── COUNTRIES ──────────────────────────────────────────────────
  const countries = ['Ghana', 'Malawi', 'Tanzania', 'Zambia', 'Zimbabwe'];

  // ── DISTRICTS (6 per country) ──────────────────────────────────
  const districts = {
    Ghana:    ['Accra Metro', 'Kumasi Metro', 'Ejura Sekyedumase', 'Awutu Senya', 'Birim Central', 'Kpando'],
    Malawi:   ['Lilongwe', 'Blantyre', 'Mzimba', 'Balaka', 'Chiradzulu', 'Chikwawa'],
    Tanzania: ['Bagamoyo', 'Chamwino', 'Chato', 'Chalinze', 'Gairo', 'Kilosa'],
    Zambia:   ['Kabwe', 'Chipata', 'Kafue', 'Chililabombwe', 'Chingola', 'Lusaka'],
    Zimbabwe: ['Buhera', 'Bulawayo', 'Chiredzi', 'Binga', 'Chinhoyi', 'Masvingo']
  };

  // ── SCHOOLS (5 per district) ───────────────────────────────────
  // Named deterministically from the district name + a fixed suffix list.
  const schools = {};
  const _suffixes = [
    'Primary School',
    'Secondary School',
    "Girls' Secondary",
    'Community Day SS',
    'Academy'
  ];
  for (const country of countries) {
    for (const district of districts[country]) {
      schools[district] = _suffixes.map(s => `${district} ${s}`);
    }
  }

  // ── YEARS ──────────────────────────────────────────────────────
  const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];

  // ── METRICS (exact labels required by the dashboard) ───────────
  const metrics = [
    'Children Supported in School with Education Bursaries',
    'Active Learner Guides',
    'Number of Clients by Form',
    'Active Partner Schools',
    'Women Supported in Tertiary Education',
    'Active Guides by Type',
    'Number of Post School Clients',
    'Grants Disbursed',
    'Loans Disbursed',
    'CAMA Members'
  ];

  // ── METRIC CONFIG ──────────────────────────────────────────────
  // base  = school-level value in 2020
  // growth = annual multiplicative growth factor
  // Financial metrics (Grants / Loans) use much larger base values.
  const _metricCfg = {
    'Children Supported in School with Education Bursaries': { base: 380,   growth: 1.040 },
    'Active Learner Guides':                                 { base: 22,    growth: 1.030 },
    'Number of Clients by Form':                             { base: 155,   growth: 1.050 },
    'Active Partner Schools':                                { base: 9,     growth: 1.020 },
    'Women Supported in Tertiary Education':                 { base: 30,    growth: 1.060 },
    'Active Guides by Type':                                 { base: 16,    growth: 1.030 },
    'Number of Post School Clients':                         { base: 85,    growth: 1.040 },
    'Grants Disbursed':                                      { base: 68000, growth: 1.070 },
    'Loans Disbursed':                                       { base: 92000, growth: 1.065 },
    'CAMA Members':                                          { base: 190,   growth: 1.050 }
  };

  // Per-country scale keeps countries meaningfully different in magnitude.
  const _countryScale = {
    Ghana: 1.00, Malawi: 0.82, Tanzania: 1.18, Zambia: 0.94, Zimbabwe: 1.06
  };

  // ── DETERMINISTIC HASH ─────────────────────────────────────────
  // djb2 variant — returns a stable non-negative integer for any string.
  function _hash(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) + h + str.charCodeAt(i)) & 0x7fffffff;
    }
    return h;
  }

  // Per-school/metric variance multiplier in the range [0.82, 1.18].
  // Same inputs always produce the same multiplier — no randomness.
  function _variance(country, district, school, metric) {
    const h = _hash(`${country}|${district}|${school}|${metric}`);
    return 0.82 + (h % 360) / 1000;
  }

  // ── BUILD FLAT DATA RECORDS ────────────────────────────────────
  // Total records: 5 countries × 6 districts × 5 schools × 10 metrics × 11 years = 16,500
  const data = [];

  for (const country of countries) {
    const cScale = _countryScale[country];

    for (const district of districts[country]) {
      for (const school of schools[district]) {
        for (const metric of metrics) {
          const { base, growth } = _metricCfg[metric];
          const v = _variance(country, district, school, metric);

          for (const year of years) {
            const yearOffset = year - 2020;
            const value = Math.round(base * Math.pow(growth, yearOffset) * cScale * v);
            data.push({ country, district, school, metric, year, value });
          }
        }
      }
    }
  }

  return { countries, districts, schools, years, metrics, data };

})();
