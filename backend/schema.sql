-- ─────────────────────────────────────────────────────────────────────────────
-- Run this entire file in the Supabase SQL Editor (as a project admin).
-- It creates one RPC function the dashboard frontend calls via the REST API.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.get_dashboard_data()
RETURNS json
LANGUAGE sql
SECURITY DEFINER
SET search_path = rep_warehouse, public
AS $$
  SELECT json_build_object(
    'data', (
      SELECT json_agg(r) FROM (

        SELECT country, district, school_name AS school, year,
               COUNT(*)::int AS value,
               'Children Supported in School with Education Bursaries' AS metric
        FROM rep_warehouse.view_children_supported
        WHERE active_on_bursary = true AND school_name IS NOT NULL AND year IS NOT NULL
        GROUP BY country, district, school_name, year

        UNION ALL

        SELECT country, district, school_name AS school, 2025 AS year,
               COUNT(*)::int AS value, 'Active Learner Guides' AS metric
        FROM rep_warehouse.view_guide_assignment
        WHERE guide_type = 'Learner Guide' AND guide_status = 'Active'
          AND school_name IS NOT NULL
        GROUP BY country, district, school_name

        UNION ALL

        SELECT country, district, school_name AS school, year,
               COUNT(*)::int AS value, 'Number of Clients by Form' AS metric
        FROM rep_warehouse.view_children_supported
        WHERE school_name IS NOT NULL AND year IS NOT NULL
        GROUP BY country, district, school_name, year

        UNION ALL

        SELECT country, district, 'District Total' AS school, year,
               COUNT(DISTINCT school_name)::int AS value, 'Active Partner Schools' AS metric
        FROM rep_warehouse.view_children_supported
        WHERE year IS NOT NULL
        GROUP BY country, district, year

        UNION ALL

        SELECT country, district, 'District Total' AS school, year,
               COUNT(*)::int AS value, 'Women Supported in Tertiary Education' AS metric
        FROM rep_warehouse.view_post_school_support
        WHERE year IS NOT NULL
        GROUP BY country, district, year

        UNION ALL

        SELECT country, district, school_name AS school, 2025 AS year,
               COUNT(*)::int AS value, 'Active Guides by Type' AS metric
        FROM rep_warehouse.view_guide_assignment
        WHERE guide_status = 'Active' AND school_name IS NOT NULL
        GROUP BY country, district, school_name

        UNION ALL

        SELECT country, district, 'District Total' AS school, year,
               COUNT(*)::int AS value, 'Number of Post School Clients' AS metric
        FROM rep_warehouse.view_post_school_support
        WHERE year IS NOT NULL
        GROUP BY country, district, year

        UNION ALL

        SELECT country, district, 'District Total' AS school, grant_year AS year,
               ROUND(SUM(amount_given::numeric))::int AS value, 'Grants Disbursed' AS metric
        FROM rep_warehouse.view_grants
        WHERE grant_year IS NOT NULL
        GROUP BY country, district, grant_year

        UNION ALL

        SELECT country, district, 'District Total' AS school, disbursal_year AS year,
               ROUND(SUM(loan_value_gbp::numeric))::int AS value, 'Loans Disbursed' AS metric
        FROM rep_warehouse.view_loans
        WHERE disbursal_year IS NOT NULL
        GROUP BY country, district, disbursal_year

        UNION ALL

        SELECT country, district, school_name AS school, join_year AS year,
               COUNT(*)::int AS value, 'CAMA Members' AS metric
        FROM rep_warehouse.view_cama_membership
        WHERE school_name IS NOT NULL AND join_year IS NOT NULL
        GROUP BY country, district, school_name, join_year

      ) r
    )
  );
$$;

-- Allow the anonymous (browser) role to call this function
GRANT EXECUTE ON FUNCTION public.get_dashboard_data() TO anon;
