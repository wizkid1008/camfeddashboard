require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const { Pool } = require('pg');

const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve the dashboard from the same origin — avoids any CORS/fetch restrictions
app.use(express.static(path.join(__dirname, '..', 'camfeddashboard')));

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl:      { rejectUnauthorized: false },
  max:      10,
  idleTimeoutMillis: 30000,
});

// Health check
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Each entry maps a dashboard metric label to a SQL query that returns
// { country, district, school, year, value } rows.
const METRIC_QUERIES = [
  {
    metric: 'Children Supported in School with Education Bursaries',
    sql: `
      SELECT country, district, school_name AS school, year, COUNT(*)::int AS value
      FROM rep_warehouse.view_children_supported
      WHERE active_on_bursary = true
        AND school_name IS NOT NULL
        AND year IS NOT NULL
      GROUP BY country, district, school_name, year`,
  },
  {
    metric: 'Active Learner Guides',
    // joined_year is null for all records — guides data is a current snapshot; use 2025
    sql: `
      SELECT country, district, school_name AS school, 2025 AS year, COUNT(*)::int AS value
      FROM rep_warehouse.view_guide_assignment
      WHERE guide_type = 'Learner Guide'
        AND guide_status = 'Active'
        AND school_name IS NOT NULL
      GROUP BY country, district, school_name`,
  },
  {
    metric: 'Number of Clients by Form',
    sql: `
      SELECT country, district, school_name AS school, year, COUNT(*)::int AS value
      FROM rep_warehouse.view_children_supported
      WHERE school_name IS NOT NULL
        AND year IS NOT NULL
      GROUP BY country, district, school_name, year`,
  },
  {
    metric: 'Active Partner Schools',
    sql: `
      SELECT country, district, 'District Total' AS school,
             year, COUNT(DISTINCT school_name)::int AS value
      FROM rep_warehouse.view_children_supported
      WHERE year IS NOT NULL
      GROUP BY country, district, year`,
  },
  {
    metric: 'Women Supported in Tertiary Education',
    sql: `
      SELECT country, district, 'District Total' AS school,
             year, COUNT(*)::int AS value
      FROM rep_warehouse.view_post_school_support
      WHERE year IS NOT NULL
      GROUP BY country, district, year`,
  },
  {
    metric: 'Active Guides by Type',
    // joined_year is null for all records — use 2025 (current snapshot year)
    sql: `
      SELECT country, district, school_name AS school, 2025 AS year, COUNT(*)::int AS value
      FROM rep_warehouse.view_guide_assignment
      WHERE guide_status = 'Active'
        AND school_name IS NOT NULL
      GROUP BY country, district, school_name`,
  },
  {
    metric: 'Number of Post School Clients',
    sql: `
      SELECT country, district, 'District Total' AS school,
             year, COUNT(*)::int AS value
      FROM rep_warehouse.view_post_school_support
      WHERE year IS NOT NULL
      GROUP BY country, district, year`,
  },
  {
    metric: 'Grants Disbursed',
    sql: `
      SELECT country, district, 'District Total' AS school,
             grant_year AS year, ROUND(SUM(amount_given::numeric))::int AS value
      FROM rep_warehouse.view_grants
      WHERE grant_year IS NOT NULL
      GROUP BY country, district, grant_year`,
  },
  {
    metric: 'Loans Disbursed',
    sql: `
      SELECT country, district, 'District Total' AS school,
             disbursal_year AS year, ROUND(SUM(loan_value_gbp::numeric))::int AS value
      FROM rep_warehouse.view_loans
      WHERE disbursal_year IS NOT NULL
      GROUP BY country, district, disbursal_year`,
  },
  {
    metric: 'CAMA Members',
    sql: `
      SELECT country, district, school_name AS school, join_year AS year, COUNT(*)::int AS value
      FROM rep_warehouse.view_cama_membership
      WHERE school_name IS NOT NULL
        AND join_year IS NOT NULL
      GROUP BY country, district, school_name, join_year`,
  },
];

// Returns full DD object matching window.DD shape used by the frontend:
//   { countries, districts, schools, years, metrics, data }
app.get('/api/data', async (req, res) => {
  try {
    const data = [];

    for (const { metric, sql } of METRIC_QUERIES) {
      const { rows } = await pool.query(sql);
      for (const r of rows) {
        data.push({
          country: r.country,
          district: r.district,
          school:   r.school,
          metric,
          year:     r.year,
          value:    r.value,
        });
      }
    }

    // Build metadata from the collected rows
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

    res.json({
      countries: [...countriesSet].sort(),
      districts,
      schools,
      years:   [...yearsSet].sort((a, b) => a - b),
      metrics: [...metricsSet],
      data,
    });
  } catch (err) {
    console.error('[/api/data]', err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CAMFED API listening on http://localhost:${PORT}`);
  console.log(`DB: ${process.env.DB_USER}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
});
