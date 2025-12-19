import { describe, expect, it } from "vitest";

import { buildUrl, isDebugLoggingEnabled, toPaginatedResult } from "./api";
import { ActivitySummary } from "./types";

describe("buildUrl", () => {
  it("creates a URL with the configured base and query params", () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "http://example.com";
    const url = buildUrl("/api/v1/activities", { limit: 10, type: "running" });
    expect(url).toBe("http://example.com/api/v1/activities?limit=10&type=running");
  });

  it("ignores empty query entries", () => {
    const url = buildUrl("/api/v1/activities", { limit: 5, search: "" });
    expect(url).toBe("http://example.com/api/v1/activities?limit=5");
  });
});

describe("toPaginatedResult", () => {
  const sample: ActivitySummary = {
    id: "1",
    type: "running",
    start_time: new Date().toISOString(),
    duration_seconds: 1200,
    provider: "garmin",
  };

  it("returns pagination metadata", () => {
    const result = toPaginatedResult<ActivitySummary>({ count: 1, items: [sample] }, 1, 10);
    expect(result.items).toHaveLength(1);
    expect(result.page).toBe(1);
    expect(result.hasMore).toBe(false);
  });
});

describe("isDebugLoggingEnabled", () => {
  it("returns true when the flag is enabled", () => {
    process.env.NEXT_PUBLIC_DEBUG_LOGGING = "true";
    expect(isDebugLoggingEnabled()).toBe(true);
  });

  it("returns false when the flag is disabled", () => {
    process.env.NEXT_PUBLIC_DEBUG_LOGGING = "false";
    expect(isDebugLoggingEnabled()).toBe(false);
  });
});
