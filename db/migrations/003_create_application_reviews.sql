CREATE TABLE IF NOT EXISTS application_reviews (
  id uuid PRIMARY KEY,
  application_id uuid NOT NULL REFERENCES career_submissions (id) ON DELETE CASCADE,
  commenter text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (application_id, commenter)
);

-- migrate:split
CREATE INDEX IF NOT EXISTS application_reviews_application_id_idx
  ON application_reviews (application_id);

-- migrate:split
CREATE INDEX IF NOT EXISTS application_reviews_commenter_idx
  ON application_reviews (commenter);
