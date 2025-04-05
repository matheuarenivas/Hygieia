
    -- Convert text fields to JSONB format
    UPDATE public.oura_sleep SET contributors = contributors::jsonb WHERE contributors IS NOT NULL;
    UPDATE public.oura_readiness SET contributors = contributors::jsonb WHERE contributors IS NOT NULL;
    UPDATE public.oura_spo2 SET spo2_percentage = spo2_percentage::jsonb WHERE spo2_percentage IS NOT NULL AND spo2_percentage != 'NULL';
    