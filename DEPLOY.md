# Deployment

This app deploys to Google App Engine Standard (Node 18), configured via `app.yml`.

## Automatic deploy (GitHub Actions)

`.github/workflows/deploy.yml` builds the React client and runs `gcloud app deploy` on every
push to `main`. **This requires one-time setup you need to do in the GCP/GitHub console —**
it is not something that can be configured from within this repo:

1. Create (or reuse) a GCP service account with the `App Engine Deployer` and
   `App Engine Service Admin` IAM roles (or `Editor`, if you want a coarser grant) on the
   target project.
2. Generate a JSON key for that service account.
3. In the GitHub repo settings, add a secret named `GCP_SA_KEY` containing the full contents
   of that JSON key file.

Until `GCP_SA_KEY` exists, the workflow will run but fail at the "Authenticate to Google Cloud"
step. Merges to `main` are still safe in the meantime -- they just won't auto-deploy.

## Manual deploy

If you'd rather deploy by hand (or before the GitHub Actions secret is configured):

```sh
npm run build        # builds client/ into public/app/
gcloud app deploy
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
