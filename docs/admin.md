# Recruitment admin

Open `/admin` to review career applications. Set `ADMIN_PASSWORD` to a unique password of at least 12 characters in `.env.local` locally and in the hosting provider's server environment in production. Restart/redeploy after changing environment variables. Never prefix the password with `NEXT_PUBLIC_`.

The existing `DATABASE_URL` must point at the careers database. If this is a fresh database, run `npm run db:migrate:careers` first. No additional migration is needed for an existing careers table.

Applications can be searched by name, USN, or email; filtered by status and role; and sorted by application date or name. Click Review or the applicant's name to read all answers. Accept, Reject, and Reset to pending persist to `career_submissions.review_status`. These actions do not email applicants.

Sessions use signed, HTTP-only, same-site cookies and expire after eight hours. Changing the password invalidates existing sessions. Production requires HTTPS. Sign out clears the current browser's cookie. Add a deployment-level rate limit to `/api/admin/login` for public production hosting.
