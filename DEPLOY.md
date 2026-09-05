# Deployment

This app deploys to Google App Engine Standard (Node 18), configured via `app.yml`.

## Automatic deploy (GitHub Actions)

`.github/workflows/deploy.yml` builds the React client and runs `gcloud app deploy` on every
push to `main`. **This requires one-time setup you need to do in the GCP/GitHub console —**
it is not something that can be configured from within this repo:

1. Create (or reuse) a GCP service account with these IAM roles on the target project
   (or `Editor`, if you want a coarser grant):
   - `App Engine Deployer` (`roles/appengine.deployer`)
   - `App Engine Service Admin` (`roles/appengine.serviceAdmin`)
   - `Cloud Build Editor` (`roles/cloudbuild.builds.editor`) -- App Engine deploys run
     through Cloud Build under the hood
   - `Storage Admin` (`roles/storage.admin`) -- Cloud Build needs a staging bucket
2. Generate a JSON key for that service account.
3. In the GitHub repo settings, add a secret named `GCP_SA_KEY` containing the full contents
   of that JSON key file.

Until `GCP_SA_KEY` exists, the workflow will run but fail at the "Authenticate to Google Cloud"
step. Merges to `main` are still safe in the meantime -- they just won't auto-deploy.

## Manual deploy

If you'd rather deploy by hand (or before the GitHub Actions secret is configured):

```sh
npm run build        # builds client/ into public/app/
gcloud app deploy app.yml   # this repo's config file is app.yml, not the gcloud default app.yaml
```

## Local development

Run the API server and the Vite dev server separately:

```sh
npm start                        # Express on :8080
cd client && npm install && npm run dev   # Vite on :5173, proxies /api to :8080
```

Visit http://localhost:5173 during development. The production build (`npm run build`) outputs
static assets to `public/app/`, which Express serves directly -- there is no separate frontend
server in production.

## Google sign-in

`/login` and `/register` both have a "Continue with Google" / "Sign up with Google" button
(`routes/google.js`, wired up since before this modernization pass -- the button just makes it
reachable from the UI). It needs two environment variables set wherever the app runs:

- `AUTHID` -- the OAuth 2.0 Client ID from the Google Cloud Console
- `AUTHSEC` -- the corresponding Client Secret

In the Google Cloud Console, under that OAuth client's **Authorized redirect URIs**, make sure
`https://maddoggsoftware.com/oauth2callback/google/` is registered -- it's hardcoded as the
callback URL in `routes/google.js`. If you ever deploy under a different domain, that URL needs
to be added there too (and in the Google Cloud Console) or the callback will fail.

## Contractor portal

Contractors log in at `/contractor` -- there's no contractor self-registration, accounts are
only created by an Admin from `/admin`. Setup, one time:

1. Register a normal account for yourself through `/register` (or already have one).
2. Promote it to Admin -- there's no UI for this bootstrap step since it's a chicken-and-egg
   problem (the `/admin` page that creates contractors is itself gated behind already being an
   Admin):
   ```sh
   npm run promote-admin -- you@example.com
   ```
3. Log in normally at `/login`. Admin accounts are redirected to `/admin` instead of the
   customer dashboard.

From `/admin`, entering a contractor's name and email (must end `@maddoggsoftware.com`) creates
their account with a generated one-time password and emails it to them via the same `ADEMAIL`/
`ADPASS` Gmail credentials `config/email.js` already uses for registration/reset emails. On
their first login at `/contractor`, they're forced to `/change-password` before reaching
anything else.
