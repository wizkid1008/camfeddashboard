-- ─────────────────────────────────────────────────────────────────────────────
-- Run this entire file in the Supabase SQL Editor (as project admin).
-- Creates a materialized view pre-computing all dashboard metrics,
-- then a single RPC function the dashboard calls.
-- ─────────────────────────────────────────────────────────────────────────────

-- Step 1 — Drop and recreate the materialized view with all metric breakdowns
DROP MATERIALIZED VIEW IF EXISTS public.dashboard_data_agg;

CREATE MATERIALIZED VIEW public.dashboard_data_agg AS

-- 1. Children Supported with Education Bursaries
SELECT country, district, school_name AS school, year,
       'Children Supported in School with Education Bursaries'::text AS metric,
       COUNT(*)::int AS value
FROM rep_warehouse.view_children_supported
WHERE active_on_bursary = true AND school_name IS NOT NULL AND year IS NOT NULL
GROUP BY country, district, school_name, year

UNION ALL

-- 2. Active Learner Guides
SELECT country, district, school_name AS school, 2025 AS year,
       'Active Learner Guides'::text AS metric,
       COUNT(*)::int AS value
FROM rep_warehouse.view_guide_assignment
WHERE guide_type = 'Learner Guide' AND guide_status = 'Active' AND school_name IS NOT NULL
GROUP BY country, district, school_name

UNION ALL

-- 3. Number of Clients by Form (all supported children)
SELECT country, district, school_name AS school, year,
       'Number of Clients by Form'::text AS metric,
       COUNT(*)::int AS value
FROM rep_warehouse.view_children_supported
WHERE school_name IS NOT NULL AND year IS NOT NULL
GROUP BY country, district, school_name, year

UNION ALL

-- 3a. Girls Supported (direct gender count)
SELECT country, district, school_name AS school, year,
       'Number of Clients by Form — Girls'::text AS metric,
       COUNT(*)::int AS value
FROM rep_warehouse.view_children_supported
WHERE school_name IS NOT NULL AND year IS NOT NULL AND gender = 'Female'
GROUP BY country, district, school_name, year

UNION ALL

-- 3b. Boys Supported (direct gender count)
SELECT country, district, school_name AS school, year,
       'Number of Clients by Form — Boys'::text AS metric,
       COUNT(*)::int AS value
FROM rep_warehouse.view_children_supported
WHERE school_name IS NOT NULL AND year IS NOT NULL AND gender = 'Male'
GROUP BY country, district, school_name, year

UNION ALL

-- 4. Active Partner Schools
SELECT country, district, 'District Total' AS school, year,
       'Active Partner Schools'::text AS metric,
       COUNT(DISTINCT school_name)::int AS value
FROM rep_warehouse.view_children_supported
WHERE year IS NOT NULL
GROUP BY country, district, year

UNION ALL

-- 5. Women Supported in Tertiary Education
SELECT country, district, 'District Total' AS school, year,
       'Number of Women Supported by CAMFED in Tertiary Education'::text AS metric,
       COUNT(*)::int AS value
FROM rep_warehouse.view_post_school_support
WHERE year IS NOT NULL
GROUP BY country, district, year

UNION ALL

-- 6. Active Guides by Type (all)
SELECT country, district, school_name AS school, 2025 AS year,
       'Active Guides by Type'::text AS metric,
       COUNT(*)::int AS value
FROM rep_warehouse.view_guide_assignment
WHERE guide_status = 'Active' AND school_name IS NOT NULL
GROUP BY country, district, school_name

UNION ALL

-- 7. Number of Post School Clients
SELECT country, district, 'District Total' AS school, year,
       'Number of Post School Clients'::text AS metric,
       COUNT(*)::int AS value
FROM rep_warehouse.view_post_school_support
WHERE year IS NOT NULL
GROUP BY country, district, year

UNION ALL

-- 8. Grants Disbursed (total value)
SELECT country, district, 'District Total' AS school, grant_year AS year,
       'Grants Disbursed'::text AS metric,
       ROUND(SUM(amount_given::numeric))::int AS value
FROM rep_warehouse.view_grants
WHERE grant_year IS NOT NULL
GROUP BY country, district, grant_year

UNION ALL

-- 9. Loans Disbursed (total value)
SELECT country, district, 'District Total' AS school, disbursal_year AS year,
       'Loans Disbursed'::text AS metric,
       ROUND(SUM(loan_value_gbp::numeric))::int AS value
FROM rep_warehouse.view_loans
WHERE disbursal_year IS NOT NULL
GROUP BY country, district, disbursal_year

UNION ALL

-- 10. CAMA Members (annual new joiners)
SELECT country, district, school_name AS school, join_year AS year,
       'CAMA Members'::text AS metric,
       COUNT(*)::int AS value
FROM rep_warehouse.view_cama_membership
WHERE school_name IS NOT NULL AND join_year IS NOT NULL
GROUP BY country, district, school_name, join_year

UNION ALL

-- 11. Active Guides — Transition
SELECT country, district, school_name AS school, 2025 AS year,
       'Active Guides — Transition'::text AS metric,
       COUNT(*)::int AS value
FROM rep_warehouse.view_guide_assignment
WHERE guide_status = 'Active' AND school_name IS NOT NULL
  AND guide_type ILIKE '%Transition%'
GROUP BY country, district, school_name

UNION ALL

-- 12. Active Guides — Agriculture
SELECT country, district, school_name AS school, 2025 AS year,
       'Active Guides — Agriculture'::text AS metric,
       COUNT(*)::int AS value
FROM rep_warehouse.view_guide_assignment
WHERE guide_status = 'Active' AND school_name IS NOT NULL
  AND guide_type ILIKE '%Agri%'
GROUP BY country, district, school_name

UNION ALL

-- 13. Active Guides — Business
SELECT country, district, school_name AS school, 2025 AS year,
       'Active Guides — Business'::text AS metric,
       COUNT(*)::int AS value
FROM rep_warehouse.view_guide_assignment
WHERE guide_status = 'Active' AND school_name IS NOT NULL
  AND (guide_type ILIKE '%Business%' OR guide_type ILIKE '%Enterprise%')
GROUP BY country, district, school_name

UNION ALL

-- 14. Grants Distributed — Count (number of individual grants)
SELECT country, district, 'District Total' AS school, grant_year AS year,
       'Grants Distributed — Count'::text AS metric,
       COUNT(*)::int AS value
FROM rep_warehouse.view_grants
WHERE grant_year IS NOT NULL
GROUP BY country, district, grant_year

UNION ALL

-- 15. Loans Disbursed — Agriculture (count of loans)
SELECT country, district, 'District Total' AS school, disbursal_year AS year,
       'Loans Disbursed — Agriculture'::text AS metric,
       COUNT(*)::int AS value
FROM rep_warehouse.view_loans
WHERE disbursal_year IS NOT NULL AND loan_type ILIKE '%Agri%'
GROUP BY country, district, disbursal_year

UNION ALL

-- 16. Loans Disbursed — Business (count of loans)
SELECT country, district, 'District Total' AS school, disbursal_year AS year,
       'Loans Disbursed — Business'::text AS metric,
       COUNT(*)::int AS value
FROM rep_warehouse.view_loans
WHERE disbursal_year IS NOT NULL
  AND (loan_type ILIKE '%Business%' OR loan_type ILIKE '%Enterprise%')
GROUP BY country, district, disbursal_year

UNION ALL

-- 17. Loans Disbursed — Kiva (count of loans)
SELECT country, district, 'District Total' AS school, disbursal_year AS year,
       'Loans Disbursed — Kiva'::text AS metric,
       COUNT(*)::int AS value
FROM rep_warehouse.view_loans
WHERE disbursal_year IS NOT NULL AND loan_type ILIKE '%Kiva%'
GROUP BY country, district, disbursal_year

UNION ALL

-- 18. Loans Disbursed — RIF (count of loans)
SELECT country, district, 'District Total' AS school, disbursal_year AS year,
       'Loans Disbursed — RIF'::text AS metric,
       COUNT(*)::int AS value
FROM rep_warehouse.view_loans
WHERE disbursal_year IS NOT NULL AND loan_type ILIKE '%RIF%'
GROUP BY country, district, disbursal_year

WITH NO DATA;

-- Step 2 — Refresh (populate with live data)
REFRESH MATERIALIZED VIEW public.dashboard_data_agg;

-- Step 3 — RPC function (reads from pre-computed view)
CREATE OR REPLACE FUNCTION public.get_dashboard_data()
RETURNS json LANGUAGE sql SECURITY DEFINER AS $$
  SELECT json_build_object('data', json_agg(r))
  FROM (SELECT * FROM public.dashboard_data_agg) r;
$$;

GRANT SELECT ON public.dashboard_data_agg TO anon;
GRANT EXECUTE ON FUNCTION public.get_dashboard_data() TO anon;
