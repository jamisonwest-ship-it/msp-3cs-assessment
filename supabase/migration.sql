-- MSP+ 3Cs Assessment Schema
-- Run this in the Supabase SQL Editor to create the required tables.

-- 1. Assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  assessor_email text NOT NULL,
  session_token uuid NOT NULL DEFAULT gen_random_uuid(),
  meta        jsonb
);

-- Index for session token lookups (history page)
CREATE UNIQUE INDEX IF NOT EXISTS idx_assessments_session_token
  ON assessments (session_token);

-- 2. Assessment people table
CREATE TABLE IF NOT EXISTS assessment_people (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id   uuid NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  person_name     text NOT NULL,
  culture         integer NOT NULL CHECK (culture BETWEEN 1 AND 10),
  competence      integer NOT NULL CHECK (competence BETWEEN 1 AND 5),
  commitment      integer NOT NULL CHECK (commitment BETWEEN 1 AND 3),
  final_rating    integer NOT NULL,
  grade           text NOT NULL,
  guidance_key    text NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assessment_people_assessment_id
  ON assessment_people (assessment_id);

-- 3. PDF artifacts table
CREATE TABLE IF NOT EXISTS pdf_artifacts (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_person_id  uuid NOT NULL REFERENCES assessment_people(id) ON DELETE CASCADE,
  storage_path          text NOT NULL,
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pdf_artifacts_person_id
  ON pdf_artifacts (assessment_person_id);

-- 4. Create storage bucket for PDFs (run via Supabase Dashboard or API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('3cs-pdfs', '3cs-pdfs', false);

-- 5. RLS policies
-- All reads AND writes now go through the service role key (server-side API routes).
-- The anon key has NO access to any table. This prevents direct Supabase REST API
-- abuse even though the anon key is exposed in NEXT_PUBLIC_* env vars.
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_people ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdf_artifacts ENABLE ROW LEVEL SECURITY;

-- No SELECT/INSERT/UPDATE/DELETE policies for anon role.
-- Service role key bypasses RLS entirely, which is all we need.
