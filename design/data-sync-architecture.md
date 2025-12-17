# Data Model and Sync Architecture

## Entity Relationship Diagram

Entities are scoped to a single tenant (user account) unless noted. Arrows denote one-to-many unless otherwise specified.

- **users** — owns many devices and activities; has profile and preferences.
- **devices** — belongs to a user; holds many activities; has firmware/version metadata.
- **activities** — belongs to a user and device; has many metrics and one route; has one summary.
- **metrics** — belongs to an activity; stores time-series or aggregated measurements.
- **routes** — belongs to an activity; stores ordered geo-points and elevation samples.
- **summaries** — belongs to an activity; single aggregated rollup (distance, time, calories, pace, heart-rate zones).

Cardinality diagram (textual):
```
users (1) ──< devices (many)
users (1) ──< activities (many)
devices (1) ──< activities (many)
activities (1) ──< metrics (many)
activities (1) ──< routes (1)
activities (1) ──< summaries (1)
```

Key attributes
- **users:** id, email, name, locale, timezone, created_at, deleted_at
- **devices:** id, user_id (FK), model, serial_number, firmware_version, last_sync_at, status
- **activities:** id, user_id (FK), device_id (FK), type, start_time, end_time, timezone, source, raw_payload_ref
- **metrics:** id, activity_id (FK), type (heart_rate, steps, cadence, power, temperature), sampling_rate, unit, series_blob_ref (points with timestamp/value), aggregates (min/max/avg)
- **routes:** id, activity_id (FK), polyline/blob_ref, start_point(lat/lng), end_point(lat/lng), elevation_gain, elevation_loss
- **summaries:** id, activity_id (FK), distance_m, duration_s, calories, avg_hr, max_hr, avg_pace, max_speed, steps, stride_length, intensity_minutes

## REST API

### Resource paths
- `GET /v1/users/{userId}` — fetch profile.
- `GET /v1/users/{userId}/devices` — list devices (filters: status, model; pagination via `page`, `page_size`).
- `POST /v1/users/{userId}/devices` — register device.
- `PATCH /v1/devices/{deviceId}` — update metadata (firmware version, status, last_sync_at).
- `GET /v1/users/{userId}/activities` — list activities (filters: date range, type, device_id, source; pagination cursor-based `cursor`, `limit`).
- `GET /v1/activities/{activityId}` — activity with summary and links to metrics/routes.
- `GET /v1/activities/{activityId}/metrics` — list metric series metadata; filter by `type`; pagination for very long lists.
- `GET /v1/activities/{activityId}/metrics/{metricId}` — retrieve series (range slicing via `start`, `end`, `downsample`).
- `GET /v1/activities/{activityId}/route` — retrieve route; optional `format=polyline|geojson` and `simplify_tolerance`.
- `GET /v1/activities/{activityId}/summary` — retrieve summary.
- `POST /v1/activities` — create activity placeholder; used during ingestion.
- `POST /v1/activities/{activityId}/metrics` — upload metric series (supports multipart or signed-URL references).
- `POST /v1/activities/{activityId}/route` — upload route blob/polyline.
- `POST /v1/activities/{activityId}/summary` — upload summary.
- `GET /v1/users/{userId}/exports` — request export jobs (filters: status, type); pagination.
- `POST /v1/users/{userId}/exports` — request export (scope: all data, date range, resource type). Returns async job id.
- `GET /v1/exports/{exportId}` — export job status; if complete, includes download URL (signed).

### Request/response patterns
- **Pagination**: Cursor-based for growing datasets (`?cursor=abc&limit=50`). Provide `next_cursor` and `prev_cursor` in response envelope.
- **Filtering**: Consistent query params (`start_date`, `end_date`, `type`, `device_id`, `source`). Use ISO-8601 timestamps.
- **Envelope** example:
```json
{
  "data": [ ... ],
  "next_cursor": "opaque-token",
  "prev_cursor": "optional",
  "total": 1200
}
```
- **Error shape**: `{ "error": { "code": "VALIDATION_ERROR", "message": "...", "fields": {"start_date": "..."} } }`
- **Idempotency**: Support `Idempotency-Key` header on POST/PATCH to avoid duplicates during sync retries.

## GraphQL API

### Schema highlights
```graphql
# Node interface for cursor pagination
interface Node { id: ID! }

type User implements Node {
  id: ID!
  email: String!
  name: String
  timezone: String
  devices(after: String, first: Int, status: DeviceStatus, model: String): DeviceConnection!
  activities(after: String, first: Int, type: ActivityType, deviceId: ID, startDate: DateTime, endDate: DateTime): ActivityConnection!
}

type Device implements Node {
  id: ID!
  model: String!
  serialNumber: String
  firmwareVersion: String
  lastSyncAt: DateTime
  status: DeviceStatus!
  activities(after: String, first: Int): ActivityConnection!
}

type Activity implements Node {
  id: ID!
  type: ActivityType!
  startTime: DateTime!
  endTime: DateTime
  device: Device
  user: User!
  metrics(types: [MetricType!], after: String, first: Int): MetricConnection!
  route(format: RouteFormat, simplifyTolerance: Float): Route
  summary: Summary
}

type Metric implements Node {
  id: ID!
  type: MetricType!
  samplingRate: Float
  unit: String
  aggregates: MetricAggregates
  series(rangeStart: DateTime, rangeEnd: DateTime, downsample: Int): [MetricPoint!]!
}

type Route implements Node {
  id: ID!
  polyline: String
  geoJson: GeoJSON
  elevationGain: Float
  elevationLoss: Float
}

type Summary {
  distanceM: Float
  durationS: Int
  calories: Int
  avgHr: Int
  maxHr: Int
  avgPace: Float
  maxSpeed: Float
}

# Connections & Pagination

type ActivityConnection { edges: [ActivityEdge!]!, pageInfo: PageInfo! }
type ActivityEdge { cursor: String!, node: Activity! }
type MetricConnection { edges: [MetricEdge!]!, pageInfo: PageInfo! }
# ... similar for DeviceConnection

type PageInfo { hasNextPage: Boolean!, hasPreviousPage: Boolean!, startCursor: String, endCursor: String }

# Mutations

type Mutation {
  registerDevice(userId: ID!, input: RegisterDeviceInput!): Device!
  createActivity(userId: ID!, deviceId: ID, input: CreateActivityInput!): Activity!
  upsertMetric(activityId: ID!, input: UpsertMetricInput!): Metric!
  upsertRoute(activityId: ID!, input: UpsertRouteInput!): Route!
  upsertSummary(activityId: ID!, input: UpsertSummaryInput!): Summary!
  requestExport(userId: ID!, scope: ExportScopeInput!): ExportJob!
}
```

### Export query examples
- `exportJobs(status: ExportStatus, after: String, first: Int): ExportJobConnection!`
- Export job includes `downloadUrl` when ready.

## Sync Flow (Webhook + Polling)

1. **Device sync event**: Ingestion service emits `device.synced` with device_id, user_id, sync_window (start/end).
2. **Webhook delivery**: For partners, POST webhook to registered endpoint with signature header (HMAC) and idempotency key.
3. **Partner ack**: Respond 2xx quickly; if 4xx/5xx, retry with exponential backoff and DLQ after N attempts.
4. **Partner follow-up**: Partner fetches delta via REST/GraphQL using filters (`start_date`/`end_date`, `device_id`). Pagination handles large result sets.
5. **Polling fallback**: If webhooks unavailable, clients poll `/activities?start_date=...&cursor=...` or GraphQL connection, storing last cursor per user.
6. **Metric slicing**: For large series, clients request ranges (`start`, `end`) or `downsample` to reduce payload size.
7. **Exports**: For bulk backfills, partners request export jobs; system prepares signed archive and signals completion via `export.ready` webhook.
8. **Reconciliation**: Clients verify completeness using `total` counts and activity/metric `updated_at` timestamps. Use `If-None-Match` / ETag for caching.

## Filtering & Indexing Considerations
- Index activities on `(user_id, start_time)` and `(user_id, device_id, start_time)` for date filtering.
- Index metrics on `(activity_id, type)`; route on `(activity_id)`.
- Store series blobs in object storage; DB holds metadata and pointers.
- Soft delete via `deleted_at`; API respects `include_deleted` flag for compliance exports.

## Export Formats
- **JSONL** for activities and summaries; **CSV** optional for summaries.
- **TCX/GPX/FIT** passthrough for routes when available; **GeoJSON** for universal consumption.
- Signed URLs expire; reissue via `GET /exports/{id}` or GraphQL query.

## Admin Interface Fit
The admin console is part of the same platform and uses the same APIs and data model; it is not a separate problem. It should:

- **User and device oversight**: search users by email/id, view devices with last sync status, trigger device re-sync, and freeze/disable accounts. Uses `/users`, `/devices`, and webhooks for live status.
- **User management**: create users, issue invitations, reset passwords, rotate OAuth client credentials, and enforce MFA/2FA enrollment. Surfaces via admin-only REST/GraphQL mutations (e.g., `POST /admin/users`, `POST /admin/users/{id}/invite`, `POST /admin/users/{id}/reset-password`, `POST /admin/users/{id}/rotate-oauth-client`).
- **Data inspection**: fetch activities, routes, and metrics via the public APIs with elevated scopes; provide sampling/downloading tools to debug ingestion issues.
- **Export management**: list export jobs, retry/terminate stuck exports, and generate compliance exports on demand using the export endpoints.
- **Operational dashboards**: surface webhook delivery metrics (latency/failures), queue depth for polling jobs, and alerting hooks. Reads from the same event logs and webhook retry queues described in the sync flow.
- **RBAC and audit**: admins are represented as users with roles/permissions; all actions (resets, deletes, data views) are logged against admin ids and stored alongside normal audit logs.

### Identity, OAuth2, and 2FA considerations
- **OAuth2**: Expose authorization code with PKCE for end-user consent (partners exchange codes for access/refresh tokens), client credentials for server-to-server admin automation, and device code flow for headless devices. Admin user management includes rotation of OAuth client secrets/keys and scoping tokens to least privilege.
- **2FA/MFA**: Require MFA for admin roles and optionally enforce for end users. Support TOTP (RFC 6238) and WebAuthn security keys; expose enrollment and reset endpoints (`POST /admin/users/{id}/mfa/reset`, GraphQL `resetMfa(userId: ID!)`). Audit all MFA resets.
- **Session hardening**: Apply short-lived access tokens with refresh, IP/device fingerprint checks for admin logins, and step-up authentication before sensitive actions (password/OAuth resets, deletions, export generation).

Because the admin interface depends on the canonical APIs, any new capability should be exposed through the REST/GraphQL layer first, then consumed by the admin UI. This keeps observability, idempotency, and pagination behaviors consistent across partner and internal surfaces.
