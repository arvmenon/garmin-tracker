# Garmin Tracker

This repo tracks requirements for a privacy-first, self-hosted Garmin-first activity ingestion platform with future multi-provider support.

## Getting Started
- Review `REQUIREMENTS.md` for detailed provider scope, ingestion flows, metrics, authentication, and non-functional expectations.
- Review `ARCHITECTURE_PROPOSAL.md` for the recommended stack, Docker Compose layout, and privacy-focused hosting targets.
- Contribute changes on the `development` branch and open a pull request for review.
- Documentation-only changes do not require code builds, but tests should accompany any future implementation.

## Frontend API Base URL
- Configure the frontend to read `NEXT_PUBLIC_API_BASE_URL`.
- Use `http://api:8000` when the API runs as a Docker service.
- Use `http://host.docker.internal:<port>` when the API runs on the host; for Linux, add `extra_hosts: ["host.docker.internal:host-gateway"]` in Compose.

## Branches
- `development`: active collaboration branch for documentation and feature work.
- `work`: historical baseline branch containing the initial drafts.
