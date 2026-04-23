-- Run this in the Supabase SQL editor (or psql) to create the table
-- that the CAMFED dashboard backend reads from.

CREATE TABLE IF NOT EXISTS dashboard_data (
  id       SERIAL       PRIMARY KEY,
  country  VARCHAR(50)  NOT NULL,
  district VARCHAR(100) NOT NULL,
  school   VARCHAR(150) NOT NULL,
  metric   VARCHAR(200) NOT NULL,
  year     INTEGER      NOT NULL,
  value    INTEGER      NOT NULL
);

-- Indexes to keep filtered queries fast
CREATE INDEX IF NOT EXISTS idx_dd_country  ON dashboard_data (country);
CREATE INDEX IF NOT EXISTS idx_dd_district ON dashboard_data (district);
CREATE INDEX IF NOT EXISTS idx_dd_metric   ON dashboard_data (metric);
CREATE INDEX IF NOT EXISTS idx_dd_year     ON dashboard_data (year);

-- Grant read access to the reporting user
GRANT SELECT ON dashboard_data TO reporting_user;
