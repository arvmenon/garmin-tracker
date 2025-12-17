# Testing Strategy

This document outlines the baseline testing framework and philosophy for the Garmin tracker. Adjust as the stack solidifies, but keep these principles intact.

## Tooling (Current Recommendations)
- **Backend (TypeScript/NestJS or Express):** [Vitest](https://vitest.dev/) + [Testing Library for DOM](https://testing-library.com/docs/dom-testing-library/intro/) where applicable; use [Supertest](https://github.com/ladjs/supertest) for HTTP layer tests.
- **Backend (Python/FastAPI):** [Pytest](https://pytest.org) with [HTTPX AsyncClient](https://www.python-httpx.org/async/) for API tests and [pytest-asyncio](https://github.com/pytest-dev/pytest-asyncio) when needed.
- **Frontend (React/Next.js):** [Vitest](https://vitest.dev/) + [Testing Library React](https://testing-library.com/docs/react-testing-library/intro/) with JSDOM; prefer component-level tests over snapshots.
- **End-to-End:** [Playwright](https://playwright.dev/) for user journeys, accessibility smoke checks, and regression capture.
- **Static Analysis:** Type checking (e.g., `tsc` or `pyright`) and linting (ESLint/Flake8) should run in CI alongside tests.

## Philosophy
- **Test pyramid first:** Emphasize fast, deterministic unit tests. Add integration tests for cross-module seams and a lean set of E2E flows for critical paths (auth, sync, activity detail, dashboards).
- **Given/When/Then clarity:** Structure tests with readable arrange/act/assert phases; keep assertions specific and minimal.
- **Deterministic data:** Use factory helpers/builders to create test data; avoid global mutable fixtures. Prefer in-memory stores or isolated test databases.
- **Isolation & speed:** Keep unit tests hermetic—no network or filesystem unless explicitly mocked. Parallelize where tooling allows.
- **Coverage targets:** Aim for 80%+ statement/branch coverage on new code. Treat coverage as a guide, not a goal—prefer meaningful assertions.
- **Property-based & fuzzing:** Use property-based tests for parsing/ingestion logic (e.g., FIT/TCX parsing) where inputs are wide.
- **Regression safety:** Add tests for every bug fix. Keep flaky tests out of main; fix or quarantine immediately.

## Structure & Conventions
- **Location:** Co-locate unit tests near the code (`*.test.ts/py`) and keep integration/E2E under `tests/` with clear naming.
- **Naming:** Use descriptive test names that capture intent, not implementation. One behavior per test.
- **Fixtures:** Prefer factory functions/builders per domain object (user, activity, device). Use lightweight fixtures for shared setup and avoid deep fixture hierarchies.
- **Mocks & stubs:** Mock network and time. Avoid mocking private details—favor public seams (HTTP clients, queues, storage gateways).
- **Snapshots:** Use sparingly for small, stable outputs (e.g., API schemas). Avoid broad component snapshots that break easily.

## CI Expectations
- Tests, linting, and type checks must run in CI for every PR. Fast unit tests should run pre-commit; heavier suites (E2E) can run nightly or on main.
- Provide a minimal `npm test`/`pnpm test` or `pytest` entry point. Document any required environment variables or services.
- Measure and report test runtime in CI to keep suites lean.

## Open Items
- Confirm final frontend/backend stacks to lock tooling versions.
- Decide on coverage enforcement thresholds in CI and how to handle temporary waivers.
- Define seed/demo data strategy for integration/E2E environments.
