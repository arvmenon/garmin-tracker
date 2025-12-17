# Garmin Tracker Product Requirements (Draft)

## Scope and Data Sources
- **Initial provider:** Garmin (official APIs via user OAuth) and manual FIT/TCX uploads.
- **Sync model:** Periodic polling with optional user-triggered manual sync. Real-time webhooks can be added later if Garmin access is granted.
- **Future providers:** Design should remain multi-provider to onboard additional device ecosystems later.

## Users, Auth, and Roles
- **Authentication:** SSO-first (e.g., Google/Apple). Email/password is out of scope for MVP unless later requested.
- **Roles:** Coach and Athlete roles required. Admin interface needed for oversight/management.
- **Admin needs:** User management, provider connection status, job/ingestion health, and configuration toggles.

## Activities and Metrics (MVP)
- **Activity types:** Running and Cycling to start.
- **Metrics:** Core activity stats (distance, duration, pace/speed, elevation gain), heart rate, cadence, power (where available), GPS routes, splits/laps, and device metadata.
- **Dashboards:** Responsive, modern UI with charts for trends; support light/dark themes in design system.

## UX and Platform
- **Targets:** Desktop and mobile web with highly responsive layout. Plan for PWA-capable shell but offline support can be scoped later.
- **Charts:** Interactive charts (zoom/pan/hover) with export options; favor performance and reuse across dashboards.

## Data and Deployment
- **Storage:** Relational database (Postgres preferred) for activities, metrics, and auth/session data.
- **Containerization:** Docker deployment; expect multi-service setup (API, worker, database, reverse proxy) for production.
- **Background work:** Queue/worker for ingestion, polling, and file processing.

## Open Questions / Next Decisions
- Choose charting library (e.g., Recharts, ECharts, Chart.js) and frontend stack.
- Pick backend framework (e.g., FastAPI, NestJS) and queuing system.
- Define notification needs (email/push) and sharing/export features (CSV/GPX/FIT exports).
- Set branding guidelines (colors/typography) and accessibility targets (WCAG level).
- Confirm performance targets (API latency, chart render budgets) and data retention policies.

## Suggested Next Steps
1. Finalize architecture stack (frontend, backend, DB, worker, charting library, auth provider).
2. Draft wireframes for onboarding, dashboard, activity detail, comparison, and admin screens.
3. Design ERD and API contracts (Garmin OAuth flow, FIT/TCX upload endpoints, polling/ingestion jobs).
4. Outline Docker Compose for API + worker + db + proxy; include local dev instructions.
5. Define monitoring, logging, and alerting for ingestion health and admin visibility.
