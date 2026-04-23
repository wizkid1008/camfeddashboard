-- ─────────────────────────────────────────────────────────────────────────────
-- Run this entire file in the Supabase SQL Editor (as a project admin).
-- Creates one small RPC function per metric so each call stays within the
-- REST API timeout. The dashboard fetches all 10 in parallel.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.get_dd_children_bursaries()
RETURNS json LANGUAGE sql SECURITY DEFINER AS $$
  SELECT json_agg(r) FROM (
    SELECT country, district, school_name AS school, year, COUNT(*)::int AS value
    FROM rep_warehouse.view_children_supported
    WHERE active_on_bursary = true AND school_name IS NOT NULL AND year IS NOT NULL
    GROUP BY country, district, school_name, year
  ) r;
$$;

CREATE OR REPLACE FUNCTION public.get_dd_learner_guides()
RETURNS json LANGUAGE sql SECURITY DEFINER AS $$
  SELECT json_agg(r) FROM (
    SELECT country, district, school_name AS school, 2025 AS year, COUNT(*)::int AS value
    FROM rep_warehouse.view_guide_assignment
    WHERE guide_type = 'Learner Guide' AND guide_status = 'Active' AND school_name IS NOT NULL
    GROUP BY country, district, school_name
  ) r;
$$;

CREATE OR REPLACE FUNCTION public.get_dd_clients_by_form()
RETURNS json LANGUAGE sql SECURITY DEFINER AS $$
  SELECT json_agg(r) FROM (
    SELECT country, district, school_name AS school, year, COUNT(*)::int AS value
    FROM rep_warehouse.view_children_supported
    WHERE school_name IS NOT NULL AND year IS NOT NULL
    GROUP BY country, district, school_name, year
  ) r;
$$;

CREATE OR REPLACE FUNCTION public.get_dd_partner_schools()
RETURNS json LANGUAGE sql SECURITY DEFINER AS $$
  SELECT json_agg(r) FROM (
    SELECT country, district, 'District Total' AS school, year,
           COUNT(DISTINCT school_name)::int AS value
    FROM rep_warehouse.view_children_supported
    WHERE year IS NOT NULL
    GROUP BY country, district, year
  ) r;
$$;

CREATE OR REPLACE FUNCTION public.get_dd_tertiary_education()
RETURNS json LANGUAGE sql SECURITY DEFINER AS $$
  SELECT json_agg(r) FROM (
    SELECT country, district, 'District Total' AS school, year, COUNT(*)::int AS value
    FROM rep_warehouse.view_post_school_support
    WHERE year IS NOT NULL
    GROUP BY country, district, year
  ) r;
$$;

CREATE OR REPLACE FUNCTION public.get_dd_guides_by_type()
RETURNS json LANGUAGE sql SECURITY DEFINER AS $$
  SELECT json_agg(r) FROM (
    SELECT country, district, school_name AS school, 2025 AS year, COUNT(*)::int AS value
    FROM rep_warehouse.view_guide_assignment
    WHERE guide_status = 'Active' AND school_name IS NOT NULL
    GROUP BY country, district, school_name
  ) r;
$$;

CREATE OR REPLACE FUNCTION public.get_dd_post_school_clients()
RETURNS json LANGUAGE sql SECURITY DEFINER AS $$
  SELECT json_agg(r) FROM (
    SELECT country, district, 'District Total' AS school, year, COUNT(*)::int AS value
    FROM rep_warehouse.view_post_school_support
    WHERE year IS NOT NULL
    GROUP BY country, district, year
  ) r;
$$;

CREATE OR REPLACE FUNCTION public.get_dd_grants()
RETURNS json LANGUAGE sql SECURITY DEFINER AS $$
  SELECT json_agg(r) FROM (
    SELECT country, district, 'District Total' AS school, grant_year AS year,
           ROUND(SUM(amount_given::numeric))::int AS value
    FROM rep_warehouse.view_grants
    WHERE grant_year IS NOT NULL
    GROUP BY country, district, grant_year
  ) r;
$$;

CREATE OR REPLACE FUNCTION public.get_dd_loans()
RETURNS json LANGUAGE sql SECURITY DEFINER AS $$
  SELECT json_agg(r) FROM (
    SELECT country, district, 'District Total' AS school, disbursal_year AS year,
           ROUND(SUM(loan_value_gbp::numeric))::int AS value
    FROM rep_warehouse.view_loans
    WHERE disbursal_year IS NOT NULL
    GROUP BY country, district, disbursal_year
  ) r;
$$;

CREATE OR REPLACE FUNCTION public.get_dd_cama_members()
RETURNS json LANGUAGE sql SECURITY DEFINER AS $$
  SELECT json_agg(r) FROM (
    SELECT country, district, school_name AS school, join_year AS year,
           COUNT(*)::int AS value
    FROM rep_warehouse.view_cama_membership
    WHERE school_name IS NOT NULL AND join_year IS NOT NULL
    GROUP BY country, district, school_name, join_year
  ) r;
$$;

GRANT EXECUTE ON FUNCTION public.get_dd_children_bursaries()  TO anon;
GRANT EXECUTE ON FUNCTION public.get_dd_learner_guides()       TO anon;
GRANT EXECUTE ON FUNCTION public.get_dd_clients_by_form()      TO anon;
GRANT EXECUTE ON FUNCTION public.get_dd_partner_schools()      TO anon;
GRANT EXECUTE ON FUNCTION public.get_dd_tertiary_education()   TO anon;
GRANT EXECUTE ON FUNCTION public.get_dd_guides_by_type()       TO anon;
GRANT EXECUTE ON FUNCTION public.get_dd_post_school_clients()  TO anon;
GRANT EXECUTE ON FUNCTION public.get_dd_grants()               TO anon;
GRANT EXECUTE ON FUNCTION public.get_dd_loans()                TO anon;
GRANT EXECUTE ON FUNCTION public.get_dd_cama_members()         TO anon;
