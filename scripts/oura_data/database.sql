-- -------------------------------------------------------
-- In this assignment, you'll:
--   1. Create appropriate tables in Supabase for Oura Ring data
--   2. Define proper data types and constraints
--   3. Write SQL to insert data (optional)
-- -------------------------------------------------------

-- TODO: Create a table for sleep data
-- This table should store daily sleep metrics from the Oura Ring
-- Tips:
--   - Review your sleep_data.csv to understand the structure
--   - Include a primary key (consider using UUID)
--   - Add appropriate data types for each column
--   - Consider adding a user_id column if multiple users will use the app
--   - Add a timestamp column for when the record was created

-- First, let's create the tables

CREATE TABLE oura_sleep (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Original ID from Oura API (optional but helpful for data consistency)
    original_id VARCHAR(255),
    
    -- Basic date and score
    day DATE NOT NULL,
    score INTEGER,
    timestamp TIMESTAMPTZ,
    
    -- Contributors (stored as JSONB for flexibility and query capabilities)
    contributors JSONB,
    
    -- Individual component scores (extracted from contributors for easier querying)
    deep_sleep_score INTEGER,
    efficiency_score INTEGER,
    latency_score INTEGER,
    rem_sleep_score INTEGER,
    restfulness_score INTEGER,
    timing_score INTEGER,
    total_sleep_score INTEGER,
    
    -- Sleep duration metrics (derived fields - can be calculated from raw data)
    total FLOAT,            -- total sleep duration in hours
    deep FLOAT,             -- deep sleep in hours
    rem FLOAT,              -- REM sleep in hours
    light FLOAT,            -- light sleep in hours
    awake FLOAT,            -- time awake in hours
    latency INTEGER,        -- sleep latency in minutes
    efficiency INTEGER,     -- sleep efficiency percentage
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(day)
);

-- Add indices for common queries
CREATE INDEX idx_oura_sleep_day ON oura_sleep(day);
CREATE INDEX idx_oura_sleep_score ON oura_sleep(score);

-- Add a comment to explain the table
COMMENT ON TABLE oura_sleep IS 'Stores daily sleep data from Oura Ring';

-- TODO: Create a table for heart rate data
-- Heart rate data will be high-volume with many readings per day
-- Tips:
--   - Heart rate data includes timestamps for each reading
--   - Will need a different structure than daily summary tables
--   - Consider indexing columns that will be frequently queried

CREATE TABLE oura_heart_rate (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Original ID from Oura API
    original_id VARCHAR(255),
    
    -- User reference - since you mentioned you're the only user, this could be optional
    -- user_id UUID REFERENCES auth.users(id),
    
    -- Timestamp when this heart rate measurement was taken
    timestamp TIMESTAMPTZ NOT NULL,
    
    -- The actual heart rate value (in bpm)
    bpm INTEGER NOT NULL,
    
    -- Source of the measurement (typically "ppg" for Oura)
    source VARCHAR(50),
    
    -- Recording type (like "rest", "active", etc.)
    type VARCHAR(50),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indices for faster queries
CREATE INDEX idx_heart_rate_timestamp ON oura_heart_rate(timestamp);
-- We're removing the user_id index since you're the only user
-- CREATE INDEX idx_heart_rate_user_timestamp (user_id, timestamp);

-- Add a comment to explain the table
COMMENT ON TABLE oura_heart_rate IS 'Stores heart rate measurements from Oura Ring';

-- TODO: Create a table for activity data
-- This should capture daily activity metrics

CREATE TABLE oura_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_id VARCHAR(255),
    day DATE NOT NULL,
    score INTEGER,
    active_calories INTEGER,
    steps INTEGER,
    calories_out INTEGER,
    contributors JSONB,    -- Store contributors as JSONB like in sleep table
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(day)
);

-- Add indices for common queries
CREATE INDEX idx_oura_activity_day ON oura_activity(day);
CREATE INDEX idx_oura_activity_score ON oura_activity(score);

COMMENT ON TABLE oura_activity IS 'Stores daily activity data from Oura Ring';

-- TODO: Create a table for readiness data
-- This should capture daily readiness scores and contributors

CREATE TABLE oura_readiness (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_id VARCHAR(255),
    day DATE NOT NULL,
    score INTEGER,
    contributors JSONB,    -- This should be JSONB to match your sleep data format
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(day)
);

-- Add indices for common queries
CREATE INDEX idx_oura_readiness_day ON oura_readiness(day);
CREATE INDEX idx_oura_readiness_score ON oura_readiness(score);
CREATE INDEX idx_readiness_contributors ON oura_readiness USING GIN (contributors);

COMMENT ON TABLE oura_readiness IS 'Stores daily readiness data from Oura Ring';

-- - oura_sleep_time
CREATE TABLE oura_sleep_time (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_id VARCHAR(255),
    day DATE NOT NULL,
    bedtime_start TIMESTAMPTZ,
    bedtime_end TIMESTAMPTZ,
    duration INTEGER,       -- duration in seconds
    contributors JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(day)
);

-- Add indices for common queries
CREATE INDEX idx_oura_sleep_time_day ON oura_sleep_time(day);

COMMENT ON TABLE oura_sleep_time IS 'Stores sleep timing data from Oura Ring';

-- - oura_spo2 (blood oxygen)
CREATE TABLE oura_spo2 (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_id VARCHAR(255),
    
    -- Day reference (changed from timestamp to match CSV)
    day DATE NOT NULL,
    
    -- SpO2 data (stored as JSONB to match CSV format)
    spo2_percentage JSONB,
    
    -- Breathing disturbance index
    breathing_disturbance_index FLOAT,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
    
    -- Note: No UNIQUE constraint on day because there can be multiple readings per day
);

-- Indexing for faster queries
CREATE INDEX idx_spo2_day ON oura_spo2(day);
CREATE INDEX idx_spo2_breathing_index ON oura_spo2(breathing_disturbance_index);

COMMENT ON TABLE oura_spo2 IS 'Stores blood oxygen (SpO2) measurements from Oura Ring';

-- - oura_stress
CREATE TABLE oura_stress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_id VARCHAR(255),
    day DATE NOT NULL,
    stress_high INTEGER,      -- seconds of high stress
    recovery_high INTEGER,    -- seconds of high recovery
    day_summary VARCHAR(50),  -- summary label (restored, normal, stressful)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(day)
);

-- Add indices for common queries
CREATE INDEX idx_oura_stress_day ON oura_stress(day);
CREATE INDEX idx_oura_stress_day_summary ON oura_stress(day_summary);

COMMENT ON TABLE oura_stress IS 'Stores daily stress data from Oura Ring';

-- Add JSONB indices for all tables that use JSONB
CREATE INDEX idx_sleep_contributors ON oura_sleep USING GIN (contributors);
CREATE INDEX idx_activity_contributors ON oura_activity USING GIN (contributors);
CREATE INDEX idx_spo2_percentage ON oura_spo2 USING GIN (spo2_percentage);

-- -------------------------------------------------------
-- Sample Queries for JSONB Data
-- These show how to effectively query the JSONB contributors field
-- -------------------------------------------------------

-- Get sleep records where deep sleep score was below 70
-- Example showing how to query inside JSONB fields
SELECT * FROM oura_sleep 
WHERE (contributors->>'deep_sleep')::integer < 70;

-- Find your best REM sleep days
-- Example showing how to extract and order by a specific JSON value
SELECT day, score, contributors->>'rem_sleep' as rem_score
FROM oura_sleep
ORDER BY (contributors->>'rem_sleep')::integer DESC
LIMIT 5;

-- Calculate average scores for each contributor type
-- Example showing how to aggregate values from a JSONB field
SELECT 
  AVG((contributors->>'deep_sleep')::integer) as avg_deep_sleep,
  AVG((contributors->>'efficiency')::integer) as avg_efficiency,
  AVG((contributors->>'latency')::integer) as avg_latency
FROM oura_sleep;

-- Find days where multiple factors were low
-- Example showing how to filter on multiple JSONB values
SELECT day, score, contributors 
FROM oura_sleep
WHERE (contributors->>'deep_sleep')::integer < 70
  AND (contributors->>'rem_sleep')::integer < 50;

-- -------------------------------------------------------
-- Example JSONB Update Operations
-- -------------------------------------------------------

-- Update a single value within the JSONB
-- Example showing how to modify just one field in a JSONB document
-- UPDATE oura_sleep
-- SET contributors = jsonb_set(contributors, '{deep_sleep}', '80')
-- WHERE day = '2025-03-05';

-- Add a new field to the JSONB
-- Example showing how to add a new field to existing JSONB
-- UPDATE oura_sleep
-- SET contributors = contributors || '{"notes": "Good night sleep"}'::jsonb
-- WHERE day = '2025-03-05';

-- -------------------------------------------------------
-- BONUS: Write a query to find the average sleep score by day of week
-- This will help identify patterns in sleep quality
-- -------------------------------------------------------

SELECT 
  EXTRACT(DOW FROM day) as day_of_week,
  -- 0 = Sunday, 1 = Monday, etc.
  CASE EXTRACT(DOW FROM day)
    WHEN 0 THEN 'Sunday'
    WHEN 1 THEN 'Monday'
    WHEN 2 THEN 'Tuesday'
    WHEN 3 THEN 'Wednesday'
    WHEN 4 THEN 'Thursday'
    WHEN 5 THEN 'Friday'
    WHEN 6 THEN 'Saturday'
  END as weekday,
  AVG(score) as avg_sleep_score,
  COUNT(*) as number_of_days
FROM oura_sleep
GROUP BY day_of_week
ORDER BY day_of_week;

COPY public.oura_heart_rate(bpm, source, timestamp)
FROM 'heart_rate_data.csv'
WITH (FORMAT CSV, HEADER true);

COPY public.oura_sleep(original_id, day, score, contributors, timestamp)
FROM 'sleep_data.csv'
WITH (FORMAT CSV, HEADER true);

-- Then convert the contributors text to JSONB
UPDATE public.oura_sleep 
SET contributors = contributors::jsonb;

COPY public.oura_activity(original_id, day, score, active_calories, steps, calories_out)
FROM 'daily_data.csv'
WITH (FORMAT CSV, HEADER true);

COPY public.oura_readiness(original_id, day, score, contributors)
FROM 'daily_readiness.csv'
WITH (FORMAT CSV, HEADER true);

-- Then convert contributors to JSONB
UPDATE public.oura_readiness
SET contributors = contributors::jsonb;

COPY public.oura_sleep_time(original_id, day, bedtime_start, bedtime_end, duration)
FROM 'sleep_time_data.csv'
WITH (FORMAT CSV, HEADER true);

COPY public.oura_spo2(original_id, day, spo2_percentage, breathing_disturbance_index)
FROM 'blood_oxygen_data.csv'
WITH (FORMAT CSV, HEADER true);

-- Then convert spo2_percentage to JSONB
UPDATE public.oura_spo2
SET spo2_percentage = spo2_percentage::jsonb;

COPY public.oura_stress(original_id, day, stress_high, recovery_high, day_summary)
FROM 'stress_data.csv'
WITH (FORMAT CSV, HEADER true);
