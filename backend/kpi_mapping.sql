-- ─────────────────────────────────────────────────────────────────────────────
-- Run this in the Supabase SQL Editor (warehouse project: qlvayqyihfixikfqfelu)
-- Creates public.kpi_mapping and populates Education Reach rows.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.kpi_mapping (
  id                        serial PRIMARY KEY,
  dashlet_element           integer NOT NULL,
  kpi_id                    text    NOT NULL,
  disaggregation_level_one  text,
  disaggregation_level_two  text,
  source_table              text    NOT NULL DEFAULT 'rep_warehouse.view_observed_kpi',
  dashboard_page            text    NOT NULL,
  data_element              text    NOT NULL,
  toggle                    text
);

-- Allow the anon key to read the mapping table
ALTER TABLE public.kpi_mapping ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon read" ON public.kpi_mapping;
CREATE POLICY "Allow anon read" ON public.kpi_mapping
  FOR SELECT USING (true);

-- ── Education Reach rows ──────────────────────────────────────────────────────
-- Dashlet 1–2 are the Bursary chart (kpi 1.1)
-- Dashlet 3–4 are CAMA & Community Champions (kpi 1.2a)
-- Dashlet 5–6 are Total Girls (kpi 1.3)
-- Dashlet 7–8 are Total Boys  (kpi 1.3)
-- Dashlet 9–10 are Bursary Cumulative options (extra toggles not in spreadsheet v2)

INSERT INTO public.kpi_mapping
  (dashlet_element, kpi_id, disaggregation_level_one, disaggregation_level_two, dashboard_page, data_element, toggle)
VALUES
  -- Girls Supported with Education Bursaries
  (1,  '1.1', 'Annual',                 'Girls Total', 'Girls Education: Education Reach', 'Girls Supported in School with Education Bursaries', 'Annual'),
  (2,  '1.1', 'Newly supported',        'Girls Total', 'Girls Education: Education Reach', 'Girls Supported in School with Education Bursaries', 'Newly Supported'),
  (9,  '1.1', 'Cumulative (2020-2030)', 'Girls Total', 'Girls Education: Education Reach', 'Girls Supported in School with Education Bursaries', 'Cumulative 2020-2030'),
  (10, '1.1', 'Cumulative (all-time)',  'Girls Total', 'Girls Education: Education Reach', 'Girls Supported in School with Education Bursaries', 'Cumulative All-time'),

  -- Girls Supported by CAMA & Community Champions
  (3, '1.2a', 'Annual',          NULL, 'Girls Education: Education Reach', 'Girls Supported in School by CAMA & Community Champions', 'Annual'),
  (4, '1.2a', 'Newly supported', NULL, 'Girls Education: Education Reach', 'Girls Supported in School by CAMA & Community Champions', 'Newly Supported'),

  -- Total Girls Supported
  (5, '1.3', 'Annual',          'Girls', 'Girls Education: Education Reach', 'Total Girls Supported', 'Annual'),
  (6, '1.3', 'Newly supported', 'Girls', 'Girls Education: Education Reach', 'Total Girls Supported', 'Newly Supported'),

  -- Total Boys Supported
  (7, '1.3', 'Annual',          'Boys', 'Girls Education: Education Reach', 'Total Boys Supported', 'Annual'),
  (8, '1.3', 'Newly supported', 'Boys', 'Girls Education: Education Reach', 'Total Boys Supported', 'Newly Supported');
