# Garmin Tracker Requirements

## Provider Scope
- **Primary provider:** Garmin is the core and first-class data source for launch.
- **Multi-provider readiness:** Interfaces must allow future integrations (e.g., Strava, Fitbit, Apple Health) without changing ingestion or storage schemas. Each provider should map to a shared activity domain model with provider-specific adapters.

## Ingestion Methods
- **Garmin API (preferred):** OAuth 2.0 authorization code flow with refresh tokens. Use Garmin Health API webhooks for activity creation/updates where available; otherwise poll incrementally using provider cursors. Periodic polling is sufficient for launch.
- **File upload (required):** User-uploaded FIT/TCX (and optionally GPX) files mapped into the same activity model. Validate schema, deduplicate by (user, start_time, distance, provider_id/hash), and surface upload errors.
- **Manual sync:** Allow users to trigger an on-demand sync in addition to scheduled polling/webhooks.
- **Idempotency & retries:** All ingestion endpoints must be idempotent and safe for retries. Store provider sync checkpoints per user.
- **Polling/default cadence:** Start with 15–30 minute polling where webhooks are unavailable, with a per-user cursor. Surface next-run ETA to users/admins. Throttle manual sync requests per user to avoid back-pressure.
- **Minimum viable Garmin flow:**
  1. User completes Garmin OAuth to link account (OIDC session for app sign-in).
  2. System stores refresh token/consent scopes and sets a provider sync cursor.
  3. Webhook delivers activities; fallback poll fetches incremental activities since last cursor.
  4. Activities normalized into shared model, deduped against file uploads/API results, and queued for downstream metrics.
  5. User/admin can trigger manual sync to re-run steps 3–4 with current cursor and capture errors in the activity timeline/admin logs.
  6. Admin UI exposes per-user sync health (last success/error, cursor position) and allows replays.

### Data Lifecycle
- **Retention:** Define default retention for raw payloads (e.g., 30–90 days) and long-term retention for normalized activities/metrics per compliance needs.
- **Deletion/export:** Provide per-user deletion/export and propagate deletes to providers when required. Track SLA for acknowledging deletion to users/admins.
- **Versioning:** Track source payload version and transformation version to allow reprocessing when parsers change.

### Data Integration Open Questions
- **Garmin data access:** Do we already have Garmin Health API credentials and webhook endpoints registered, or should we plan a sandbox/prod credential setup timeline?
- **Webhook hosting:** Where will webhooks be hosted (cloud provider/region, VPC/private networking), and do we need IP allowlisting for Garmin callbacks?
- **Historical backfill:** Should we fetch full history on first connect or only recent activities? Are there time limits per provider agreement?
- **File uploads at scale:** Expected upload volume/size caps (e.g., per-file MB limit, monthly volume), and do we need virus scanning or content validation beyond FIT/TCX schema checks?
- **Deduplication policy:** If the same activity appears via API and file upload, should API be the source of truth, or do we prefer most recent payload? How should we surface conflicts to users/admins?
- **Data residency/compliance:** Any residency requirements (e.g., EU-only storage), PII handling rules, or audit retention policies that affect ingestion pipelines and storage?
- **Sync cadence and back-pressure:** What polling interval is acceptable for "periodic" sync, and should we throttle or batch when users request many manual syncs concurrently?
- **Provider credential ownership:** Who owns/maintains Garmin (and future provider) app registrations, and how should we rotate secrets or add new redirect URIs?
- **User consent and scope changes:** How should we handle additional scopes (e.g., body composition) later—re-prompt users, or restrict to current scope until upgrade?
- **Data deletion:** What is the required SLA for honoring user data deletion/export requests, and do we need per-provider deletion callbacks?
- **Error handling UX:** Should ingestion errors be surfaced only in admin tools, or also to athletes/coaches with remediation steps?
- **Manual sync controls:** Who can initiate manual syncs (athlete only, coach, admin), and do we need per-tenant rate limits?
- **Upload governance:** Do uploads require virus scanning and PII scrubbing, and should admin tools allow bulk upload review/approval queues?

## Activity Types
- Launch scope: running and cycling (road/indoor).
- Represent additional activity types in a normalized lookup so new types can be added without code changes to metrics handling.

## Required Metrics
- **Core:** start time, end time/duration, distance, elapsed time, active time, calories, average and max heart rate, device, and source provider.
- **Location:** GPS track points (lat/long/elevation) with timestamps and sampling rate, plus summary stats (elevation gain/loss).
- **Pace/speed:** average pace or speed; per-split summaries (e.g., per km/mile) when available.
- **Power & cadence:** cycling power (avg/max/NP) and cadence; running cadence and stride length where available.
- **Swim:** laps, strokes, pool length, SWOLF when present.
- **Strength:** sets, reps, and weight by exercise when present.
- **Quality flags:** detection of gaps, pauses, manual entries, and sensor errors.

## Notifications & Sharing
- **Notifications:** Optional user opt-in for sync success/fail alerts and new-activity summaries (email/push/web). Support per-channel preferences.
- **Sharing:** User-controlled sharing of activities via private links and export (GPX/FIT/CSV). No public feed by default; explicit share per activity. Respect provider terms for redistribution.

## Authentication & Authorization
- **Auth methods:**
  - User auth via SSO (OIDC/SAML) with MFA support.
  - Provider linking via Garmin OAuth 2.0 auth code flow.
- **Roles:**
  - `athlete`: owns activities, manages personal data and sharing.
  - `coach`: can view athlete activities when invited/authorized, optionally leave notes/feedback.
  - `admin`: manages platform configuration (provider credentials, quotas), handles user support, audits ingestion jobs, and administers roles.
  - `service`: internal job/service accounts for ingestion pipelines with least-privilege scopes.
- **SSO details to confirm:** Preferred SSO standards (OIDC vs. SAML), identity provider options, and whether just-in-time provisioning is allowed for coaches/admins.
- **Admin interface expectations:** Minimum admin actions (user lookup, role changes, resend invites, rotate provider secrets), audit log visibility, and requirement for justifications on privileged changes.
- **Security:**
  - Enforce least privilege per role with RBAC. Keep provider tokens encrypted at rest. Rotate client secrets. Require consent for scopes requested from Garmin.
  - Session management with short-lived access tokens and refresh tokens; support revocation and audit logging of ingestion events.
  - Provide an admin interface for user/role management and provider configuration.

## Non-Functional
- **Scalability:** Design ingestion to be horizontally scalable; queue-based processing for webhooks/uploads.
- **Observability:** Structured logs per provider, metrics on latency/failure rates, and dead-letter queues for ingestion errors. Netdata is out of scope unless explicitly enabled, to avoid implicit database users and startup dependencies in the default Compose setup.
- **Data consistency:** Strong consistency for user-facing reads after ingestion completion; eventual consistency acceptable during in-flight sync.
- **Frontend/API connectivity:** The frontend must read its API base URL from `NEXT_PUBLIC_API_BASE_URL` so Docker deployments can point it at an internal service name (e.g., `http://api:8000`) or the Docker host (`http://host.docker.internal:<port>`) for local development.
- **Frontend build persistence:** Docker Compose must mount a dedicated named volume (e.g., `frontend_build`) to persist Next.js build artifacts (`/app/.next`) across container restarts.

## Database Provisioning & Operations
- **Bootstrap workflow:** Database setup must be repeatable from zero and safe to re-run; use a single documented flow for local, staging, and production.
- **Roles & access:** Separate roles for migrations, application write access, and read-only analytics/export usage.
- **Migrations:** Every schema change ships as a migration with explicit rollback guidance; migrations are executed by a single job per deploy.
- **Seed data:** Reference data (activity types, device catalogs, RBAC defaults) must be versioned and tracked in a `seed_history` table.
- **Reset policy:** Local development can drop and rebuild data; staging/production reset is forbidden outside approved disaster recovery procedures.
- **Backup readiness:** Backups and restore drills are required; WAL archiving enabled wherever durability matters.
- **Monitoring users:** Database bootstrap must not assume Netdata credentials or create monitoring users unless the integration is explicitly enabled and configured.

## Caching Strategy
- **API responses:** Cache read-heavy endpoints (activity lists, summary stats) in Redis with short TTLs (30–120s) and per-user keys; bust cache on ingest/update events.
- **Charts & aggregates:** Precompute daily/weekly aggregates and cache chart datasets separately from raw activity detail. Include version stamps on cached chart payloads to avoid stale schema reads.
- **Provider calls:** Cache Garmin metadata (device catalog, activity type lookups) for hours to reduce upstream calls while keeping user-specific data uncached for freshness.
- **Client hints:** Encourage HTTP caching (ETag/Last-Modified) on static assets and public docs; disable caching on authenticated responses that include PII unless explicitly covered above.

## Rate Limits & Throttling
- **Public/API gateway:** Per-IP rate limit for auth endpoints (e.g., 20 req/min) and global burst limits to deter brute force. Return `429` with retry-after headers.
- **Per-user:** Limit manual sync triggers (e.g., 3 per hour) and file uploads (size and count) per user/tenant. Protect export downloads with signed URLs and short expirations.
- **Provider safety:** Enforce back-pressure for Garmin API polling/webhooks to stay under vendor quotas; queue retries with exponential backoff and jitter.

## Audit Logging
- **Coverage:** Record authentication events, role/permission changes, provider linking/unlinking, manual sync actions, exports/downloads, and data deletion requests.
- **Content:** Include actor, target user/resource, action, justification (where applicable), timestamp, source IP/device, and success/failure with error codes.
- **Access:** Store immutable append-only logs with tamper-evident hashing; expose filtered views to admins with search/export while enforcing RBAC.

## Encryption & Secrets
- **In transit:** Enforce TLS for all endpoints; mutual TLS for admin/control plane when possible.
- **At rest:** Encrypt databases, object storage, and backups. Provider tokens and refresh tokens stored encrypted using KMS/host-managed keys; rotate keys regularly.
- **Secrets management:** Use environment variables sourced from a secrets manager (or host-level vault) with audit trails; never persist secrets in logs or exports.

## Compliance & Governance
- **Privacy:** Treat user identities and GPS/location data as sensitive; default to least-privilege access and minimize retention of raw payloads (30–90 days unless required longer).
- **Data subject rights:** Provide self-service export/deletion with SLA tracking and confirmation, and propagate deletions to providers when applicable.
- **Policies:** Maintain access reviews for admin/service accounts, change management with approvals for schema/storage changes, and incident response playbooks covering data leaks.
- **Standards alignment:** Design controls to map to GDPR (consent, data minimization, residency considerations) and SOC 2 trust principles (security, availability, confidentiality) even if certification is future-phase.

## Performance Targets
- **API latency:** P95 authenticated read endpoints ≤300 ms; write/ingestion-trigger endpoints ≤500 ms excluding background job processing. Webhook ingestion acknowledged within 200 ms before async processing.
- **Dashboards/charts:** Initial dashboard load time budget 2–3 seconds on broadband; chart render/update P95 ≤800 ms after data fetch, with datasets paginated or windowed for long activities.
- **Background jobs:** Polling and webhook-to-durable-store pipeline end-to-end within 30 seconds under normal load; exports generated within 2 minutes for typical weekly ranges.

## Testing Approach
- **Unit tests:** Cover parsers, deduplication, normalization, and role checks with deterministic fixtures; target high coverage on ingestion and sharing logic.
- **Integration/E2E:** Exercise OAuth linking, webhook receipt, manual sync, file upload, and admin audit views via headless runs; include regression tests for chart rendering and RBAC.
- **Load & resilience:** Run periodic load tests for ingestion throughput and dashboard queries to validate rate limits/latency targets; include chaos tests for queue/db/redis outages and back-pressure behavior.

## Assumptions & Dependencies
- Garmin Health API credentials (sandbox and production) will be provisioned and owned by the platform team, with redirect URIs and webhook URLs registered up front.
- Webhook hosting will be reachable by Garmin without private-network constraints; any IP allowlists are managed by the platform.
- A queueing layer (e.g., SQS, Pub/Sub, RabbitMQ) is available for decoupling ingestion from downstream processing.
- Object storage is available for raw payload retention and export packaging (e.g., S3, GCS) with lifecycle policies configured.

## Out of Scope (Initial Launch)
- Social feeds, public discovery, or leaderboard features beyond explicit per-activity sharing links.
- Real-time streaming sync; periodic polling and webhook-driven ingestion are sufficient for launch.
- In-app training plan authoring; coaches may attach notes/feedback but not full plan builders in v1.
