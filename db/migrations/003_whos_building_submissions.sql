-- "Who's Building" replaces the old Idea Box question set.
-- Instead of altering idea_submissions (which would touch existing rows),
-- this creates a fresh table for the new form. The old idea_submissions
-- table is left completely untouched as a historical archive.

CREATE TABLE IF NOT EXISTS whos_building_submissions (
  id uuid PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  full_name text NOT NULL,
  usn text NOT NULL,
  email text NOT NULL,
  portfolio_url text,
  phone text NOT NULL,
  project_name text NOT NULL,
  domain text NOT NULL,
  product_category text NOT NULL,
  problem text NOT NULL,
  solution text NOT NULL,
  prototype_status text NOT NULL,
  traction text NOT NULL,
  team_status text NOT NULL,
  team_size text NOT NULL,
  team_roles text NOT NULL,
  looking_for_collaborators text NOT NULL,
  collaborator_needs text,
  business_potential text NOT NULL,
  support_needs jsonb NOT NULL,
  next_milestone text NOT NULL,
  funding_estimate text,
  github_url text,
  demo_url text,
  website_url text,
  pitch_deck_url text,
  consent_review boolean NOT NULL,
  consent_share boolean NOT NULL,
  consent_feature boolean NOT NULL,
  review_status text NOT NULL DEFAULT 'new'
);

-- migrate:split
CREATE INDEX IF NOT EXISTS whos_building_submissions_created_at_idx
  ON whos_building_submissions (created_at DESC);

-- migrate:split
CREATE INDEX IF NOT EXISTS whos_building_submissions_usn_idx
  ON whos_building_submissions (usn);

-- migrate:split
CREATE INDEX IF NOT EXISTS whos_building_submissions_review_status_idx
  ON whos_building_submissions (review_status);
