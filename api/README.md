# siwe-api

The small service behind the contact form and the newsletter signup on the
site. Plain Node on `node:http` with one dependency (`pg`); email forwarding
talks to the Resend HTTP API with the fetch that ships with Node.

## Endpoints

| Endpoint           | Does                                                              |
| ------------------ | ----------------------------------------------------------------- |
| `POST /contact`    | Stores the message in PostgreSQL, then forwards it via Resend     |
| `POST /newsletter` | Stores the subscriber in PostgreSQL; resubscribing is a no-op     |
| `GET /healthz`     | 200, for the deploy healthcheck                                   |

Both POST bodies are JSON. `/contact` takes `name`, `email`, `message` and an
optional `company`; `/newsletter` takes `email` and an optional `source`.
Both accept a hidden `website` honeypot field — a filled one is answered with
a cheerful `{"ok":true}` and stored nowhere.

Storing is the success condition; forwarding is best effort. A contact row
whose `forwarded_at` is NULL was stored but never emailed — that column is the
retry queue if one is ever needed.

## Environment

| Variable          | Default                                                |
| ----------------- | ------------------------------------------------------ |
| `PORT`            | `8787`                                                 |
| `DATABASE_URL`    | — (required)                                           |
| `RESEND_API_KEY`  | unset skips forwarding, with a warning in the log      |
| `CONTACT_TO`      | `contact@siwe.xyz`                                     |
| `CONTACT_FROM`    | `siwe.xyz <contact@siwe.xyz>` — domain must be verified in Resend |
| `ALLOWED_ORIGINS` | `https://siwe.xyz,https://next.siwe.xyz,http://localhost:4321` |

## Running locally

```sh
cd api
pnpm install
DATABASE_URL=postgres://localhost/siwe pnpm dev   # or put it in api/.env
```

The schema is created on boot, so an empty database is enough. Point the site
at it with `VITE_SIWE_API_URL=http://localhost:8787 pnpm dev` from the
repository root.

## Deploying

Its own Kamal app in `config/deploy.api.yml`: same server as the site, its own
hostname (`API_HOST`, default `api.siwe.xyz` — point its DNS at `DEPLOY_HOST`),
and a PostgreSQL accessory with a persistent volume. Secrets live in
`.kamal/secrets` (see `.kamal/secrets.example`).

```sh
pnpm kamal:api:setup    # first time: boots postgres, then the app
pnpm kamal:api:deploy
pnpm kamal:api:logs
```
