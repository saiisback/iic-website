CREATE TABLE IF NOT EXISTS idea_submissions (
  id uuid PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  full_name text NOT NULL,
  usn text NOT NULL,
  email text NOT NULL,
  project_name text NOT NULL,
  summary text NOT NULL,
  problem text NOT NULL,
  solution text NOT NULL,
  domain text NOT NULL,
  prototype_status text NOT NULL,
  team_status text NOT NULL,
  support_needs jsonb NOT NULL,
  project_url text,
  consent boolean NOT NULL,
  review_status text NOT NULL DEFAULT 'new'
);

-- migrate:split
CREATE INDEX IF NOT EXISTS idea_submissions_created_at_idx
  ON idea_submissions (created_at DESC);

-- migrate:split
CREATE INDEX IF NOT EXISTS idea_submissions_usn_idx
  ON idea_submissions (usn);

-- migrate:split
CREATE INDEX IF NOT EXISTS idea_submissions_review_status_idx
  ON idea_submissions (review_status);
