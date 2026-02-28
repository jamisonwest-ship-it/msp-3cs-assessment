-- Migration: Remove permissive RLS policies
-- Run this in the Supabase SQL Editor on existing deployments.
--
-- Previously, all tables had USING(true) SELECT policies that allowed anyone
-- with the anon key to read all data. Since all API routes now use the service
-- role key (which bypasses RLS), we can safely drop these permissive policies.

DROP POLICY IF EXISTS "Allow read by session_token" ON assessments;
DROP POLICY IF EXISTS "Allow read assessment_people" ON assessment_people;
DROP POLICY IF EXISTS "Allow read pdf_artifacts" ON pdf_artifacts;

-- RLS stays enabled — with no policies, the anon key gets zero access.
-- Service role key bypasses RLS and continues to work as before.
