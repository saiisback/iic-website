CREATE TABLE IF NOT EXISTS career_submissions (
  id uuid PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  full_name text NOT NULL,
  usn text NOT NULL,
  email text NOT NULL,
  why_iic text NOT NULL,
  innovation_meaning text NOT NULL,
  talk_about text NOT NULL,
  proud_work text,
  role_type text NOT NULL,
  role_example text NOT NULL,
  mistake_response text NOT NULL,
  different_style text NOT NULL,
  learning_struggle text NOT NULL,
  campus_problem text NOT NULL,
  unlimited_problem text NOT NULL,
  contribution text NOT NULL,
  remembered_for text NOT NULL,
  expectations text NOT NULL,
  consent boolean NOT NULL,
  review_status text NOT NULL DEFAULT 'new'
);

-- migrate:split
ALTER TABLE career_submissions
  ADD COLUMN IF NOT EXISTS unlimited_problem text NOT NULL DEFAULT '';

-- migrate:split
CREATE INDEX IF NOT EXISTS career_submissions_created_at_idx
  ON career_submissions (created_at DESC);

-- migrate:split
CREATE INDEX IF NOT EXISTS career_submissions_usn_idx
  ON career_submissions (usn);

-- migrate:split
CREATE INDEX IF NOT EXISTS career_submissions_review_status_idx
  ON career_submissions (review_status);
