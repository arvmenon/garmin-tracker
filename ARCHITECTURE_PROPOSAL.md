# Platform Stack & Deployment Plan (Privacy-First Homelab)

## Objectives
- Keep all user data under direct control on a privately managed host (homelab or private VPS) with no default reliance on public cloud services.
- Minimize external dependencies; prefer self-hosted equivalents that run well on a single node and can later scale to a small cluster.
- Favor components with strong type safety, predictable resource use, and good observability hooks.

## Application Stack Choices
- **Frontend:** Next.js (React + TypeScript) with hybrid SSG/SSR for authenticated dashboards; supports incremental static regeneration for public/low-risk pages to reduce server load.
- **UI Components:** Chakra UI for accessible, themeable components; tree-shakable and easy to customize for dark-mode dashboards.
- **Charting:** Recharts for timeseries and activity trend visualizations; fallback to lightweight Chart.js for small embeds.
- **Backend API:** FastAPI (Python) for async-friendly webhook ingestion and OAuth callbacks; OpenAPI generation aids client SDKs and admin tooling.
- **Database:** PostgreSQL with PostGIS enabled for spatial queries on GPS tracks; optional TimescaleDB extension if retention policies or downsampling become necessary. Provision via a clean, repeatable bootstrap flow described below.
- **Background Jobs:** Celery workers with Redis broker to process webhooks, polling, FIT/TCX parsing, deduplication, and export tasks.
- **Object Storage:** MinIO (S3-compatible) for raw payload retention, GPX/TCX/FIT archives, and export bundles when files are too large for the database.

## Docker / Docker Compose Layout (Single-Host Friendly)
- **proxy:** Caddy or Traefik for TLS termination (supports local ACME or self-signed certs) and routing to `api` and `frontend`; can add basic auth on admin routes.
- **frontend:** Next.js container (Node 18 LTS) serving prebuilt assets via `next start`; can be folded into `proxy` as static assets if desired.
- **api:** FastAPI app container (uvicorn/gunicorn) exposing REST + webhook endpoints; mounts shared volume for static assets and FIT/TCX samples when needed.
- **worker:** Celery worker image built from the same codebase; optional `beat` scheduler container for periodic polling/backfill jobs.
- **db:** PostgreSQL with PostGIS; dedicated volume for data and WAL archiving; backups handled by a sidecar cron or host-level tools (e.g., `pgbackrest`).
- **redis:** Redis as Celery broker and cache for rate limits/session storage.
- **minio:** MinIO with persistent volume for raw payloads and exports; use server-side encryption keys stored on host.
- **observability (optional):** Loki + Promtail for logs and Grafana for dashboards; all deployed via Compose profiles for opt-in use. Netdata is excluded from the baseline stack and default Compose profiles to avoid implicit database users or startup dependencies.

## Database Setup (Greenfield Bootstrap)
This resets the database setup approach to be explicit, repeatable, and safe for both local development and production environments.

### Guiding Principles
- **Idempotent automation:** Every step must be safe to re-run without data loss unless explicitly in "reset" mode.
- **Environment parity:** Use the same bootstrap flow in local, staging, and production with only secrets and storage paths varying.
- **Least privilege:** Distinct roles for migration tasks vs. application runtime access.
- **Auditability:** Every schema change is tracked and reversible via migrations.
- **No implicit monitoring users:** Bootstrap scripts must not create or require Netdata (or other monitoring) database users unless explicitly enabled and configured.

### Bootstrap Flow (from zero)
1. **Provision secrets and storage**
   - Create unique credentials for `db_admin`, `app_writer`, and `app_reader`.
   - Allocate persistent volumes for data and WAL archives before first start.
2. **Initialize the cluster**
   - Start PostgreSQL and enable required extensions (`postgis`, `uuid-ossp`, `pgcrypto`).
   - Create dedicated schemas: `app` (operational data), `audit` (append-only logs).
3. **Apply migrations**
   - Run migration tooling (e.g., Alembic) as a one-off job using `db_admin`.
   - Lock migration execution to a single instance to avoid concurrent schema changes.
4. **Seed baseline reference data**
   - Populate activity types, device catalogs, and RBAC defaults via migrations or explicit seed scripts.
   - Store seed versions in a `seed_history` table to track applied data sets.
5. **Harden access**
   - Grant `app_writer` only the privileges needed for CRUD + function execution in `app`.
   - Grant `app_reader` read-only access and limit it to analytics or export paths.
6. **Validate readiness**
   - Run schema checks and health queries (e.g., expected extensions, migration version).
   - Confirm backup tooling can perform a full restore in a sandbox environment.

### Reset Mode (development only)
- Drop the local volume, re-run the bootstrap flow, and re-seed using fixtures.
- Never run reset mode against staging or production volumes.

### Operational Practices
- **Backups:** Continuous WAL archiving with daily full backups; quarterly restore drills.
- **Monitoring:** Track connection saturation, replication lag (if added), and slow query logs.
- **Change management:** Treat migrations as reviewed artifacts with explicit rollbacks.

## Hosting Targets & Operations (Privacy-Focused)
- **Primary target:** Single-node homelab or private VPS using Docker Compose. Run behind local DNS (e.g., `*.lan`) and secure remote access via Tailscale/WireGuard rather than public exposure.
- **TLS & identity:** Terminate TLS at `proxy` with local CA or ACME DNS-01; enforce mutual TLS for admin endpoints when possible. Secrets provided via `.env` files stored on the host and managed with `sops` or host-level password manager.
- **Backups & durability:** Host-level snapshots plus PostgreSQL WAL archiving; MinIO data synced to encrypted external drive or offline backup. UPS support recommended for graceful shutdowns.
- **Scaling path:** If more isolation is needed, migrate the Compose services to k3s on the same homelab cluster; service manifests can be generated from Compose using tools like `kompose`.
- **Optional fallback:** If a low-cost VPS is used, keep the same Compose layout, restrict ingress with firewall + WireGuard, and avoid managed cloud databases to preserve data control.

## Rationale & Notes
- Stack choices remain lightweight, open-source, and easily self-hosted without proprietary dependencies.
- Compose layout mirrors production topology while staying operable by a single admin; profiles keep observability optional to conserve resources.
- Caddy/Traefik and Tailscale/WireGuard prioritize privacy by default, enabling remote access without exposing services publicly.
