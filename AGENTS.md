# Agent Guidelines

Welcome! This repository currently holds early product requirements for a Garmin-first activity tracker. Please follow these guidelines for any future changes.

## Scope and Hierarchy
- This file applies to the entire repository unless a nested `AGENTS.md` overrides it.
- Always check for deeper `AGENTS.md` files before editing or creating files.

## Collaboration & Change Management
- Keep product requirements in `REQUIREMENTS.md` up to date when scope or decisions change.
- Prefer small, well-scoped commits with descriptive messages.
- Include a short summary and a list of tests run in your final response.

## Code & Documentation Style
- Favor clear, concise language in documentation; prefer headings and bullet lists over long paragraphs.
- When adding code, write self-documenting functions and avoid unnecessary abstractions.
- Keep error handling explicit—avoid silent failures.

## Testing Expectations
- Every code change must include or update automated tests. Documentation-only changes may skip tests but should be noted.
- Aim for fast, deterministic unit tests and prioritize the test pyramid (unit > integration > end-to-end).
- Use the testing strategy in `TESTING.md` as the baseline; update it if the stack or philosophy evolves.

## Security & Data
- Do not commit secrets or tokens. Use environment variables and `.env.example` patterns when needed.
- Handle user data with care; prefer encryption-at-rest and in-transit where applicable.
