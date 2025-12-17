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
- **Observability:** Structured logs per provider, metrics on latency/failure rates, and dead-letter queues for ingestion errors.
- **Data consistency:** Strong consistency for user-facing reads after ingestion completion; eventual consistency acceptable during in-flight sync.

## Assumptions & Dependencies
- Garmin Health API credentials (sandbox and production) will be provisioned and owned by the platform team, with redirect URIs and webhook URLs registered up front.
- Webhook hosting will be reachable by Garmin without private-network constraints; any IP allowlists are managed by the platform.
- A queueing layer (e.g., SQS, Pub/Sub, RabbitMQ) is available for decoupling ingestion from downstream processing.
- Object storage is available for raw payload retention and export packaging (e.g., S3, GCS) with lifecycle policies configured.

## Out of Scope (Initial Launch)
- Social feeds, public discovery, or leaderboard features beyond explicit per-activity sharing links.
- Real-time streaming sync; periodic polling and webhook-driven ingestion are sufficient for launch.
- In-app training plan authoring; coaches may attach notes/feedback but not full plan builders in v1.
