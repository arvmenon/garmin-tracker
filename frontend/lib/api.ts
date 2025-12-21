import { ActivityDetail, ActivitySummary, PaginatedResult, SyncStatus } from "@/lib/types";

export type QueryParams = Record<string, string | number | boolean | undefined>;

export interface ActivityListResponse {
  count: number;
  items: ActivitySummary[];
}

function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/, "");
}

export function getApiBaseUrl() {
  const configured = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (configured && configured.trim()) {
    return normalizeBaseUrl(configured);
  }

  if (typeof window !== "undefined") {
    return "";
  }

  return "http://localhost:8000";
}

export function isDebugLoggingEnabled() {
  const value = process.env.NEXT_PUBLIC_DEBUG_LOGGING ?? "";
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

function logDebug(message: string, details?: Record<string, unknown>) {
  if (!isDebugLoggingEnabled()) return;
  if (details) {
    console.info(`[api] ${message}`, details);
    return;
  }
  console.info(`[api] ${message}`);
}

function logWarn(message: string, details?: Record<string, unknown>) {
  if (!isDebugLoggingEnabled()) return;
  if (details) {
    console.warn(`[api] ${message}`, details);
    return;
  }
  console.warn(`[api] ${message}`);
}

function logError(message: string, details?: Record<string, unknown>) {
  if (!isDebugLoggingEnabled()) return;
  if (details) {
    console.error(`[api] ${message}`, details);
    return;
  }
  console.error(`[api] ${message}`);
}

export interface ApiErrorPayload {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
}

export class ApiError extends Error {
  status?: number;
  code?: string;
  details?: unknown;

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = "ApiError";
    this.status = payload.status;
    this.code = payload.code;
    this.details = payload.details;
  }
}

export function buildUrl(path: string, query?: QueryParams): string {
  if (path.startsWith("http")) {
    return buildQuery(path, query);
  }

  const baseUrl = getApiBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const basePath = baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;
  return buildQuery(basePath, query);
}

function buildQuery(basePath: string, query?: QueryParams): string {
  if (!query || Object.keys(query).length === 0) {
    return basePath;
  }

  const searchParams = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === "") return;
    searchParams.append(key, String(value));
  });

  const queryString = searchParams.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}

async function parseJson(response: Response) {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}

async function handleError(response: Response, url: string): Promise<never> {
  const body = await parseJson(response);
  const envelope =
    body && typeof body === "object" && "error" in body ? (body as { error: ApiErrorPayload }).error : null;

  const message =
    envelope?.message ||
    (body && typeof body === "object" && "detail" in body ? String((body as { detail?: unknown }).detail) : null) ||
    response.statusText ||
    "Unexpected API error";

  logWarn("Non-OK response received", {
    url,
    status: response.status,
    statusText: response.statusText,
    error: message,
  });

  throw new ApiError({
    message,
    status: response.status,
    code: envelope?.code,
    details: body,
  });
}

export async function fetchApi<T>(path: string, options?: RequestInit & { query?: QueryParams }): Promise<T> {
  const { query, ...init } = options || {};
  const url = buildUrl(path, query);
  const method = init.method ?? "GET";

  logDebug("Request started", { url, method });

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(init.headers || {}),
      },
      ...init,
    });
  } catch (error) {
    logError("Network error while calling API", {
      url,
      method,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }

  if (!response.ok) {
    await handleError(response, url);
  }

  const data = await parseJson(response);
  logDebug("Response received", { url, method, status: response.status });
  if (data && typeof data === "object" && "data" in data) {
    return (data as { data: T }).data;
  }

  return data as T;
}

export function toPaginatedResult<T>(
  response: ActivityListResponse,
  page: number,
  pageSize: number,
  filteredItems?: ActivitySummary[],
): PaginatedResult<T> {
  const items = (filteredItems || response.items) as unknown as T[];
  return {
    items,
    count: response.count ?? items.length,
    page,
    pageSize,
    hasMore: items.length >= pageSize,
  };
}

export interface ActivitiesQueryParams {
  page?: number;
  pageSize?: number;
  type?: string;
  provider?: string;
  search?: string;
}

export async function getActivities(params: ActivitiesQueryParams = {}): Promise<PaginatedResult<ActivitySummary>> {
  const { page = 1, pageSize = 10, type, provider, search } = params;
  const query: QueryParams = {
    limit: pageSize,
    page,
    type,
    provider,
    search,
  };

  const response = await fetchApi<ActivityListResponse>("/api/v1/activities", { query });

  const filtered = response.items.filter((item) => {
    const matchesType = type ? item.type === type : true;
    const matchesProvider = provider ? item.provider === provider : true;
    const matchesSearch = search
      ? [item.type, item.provider, item.id]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase()))
      : true;
    return matchesType && matchesProvider && matchesSearch;
  });

  return toPaginatedResult<ActivitySummary>(response, page, pageSize, filtered);
}

export async function getActivityDetail(activityId: string): Promise<ActivityDetail> {
  return fetchApi<ActivityDetail>(`/api/v1/activities/${activityId}`);
}

export async function getSyncStatus(): Promise<SyncStatus> {
  return fetchApi<SyncStatus>("/api/v1/health");
}

export function buildMockActivityDetail(activityId: string): ActivityDetail {
  return {
    id: activityId,
    title: "Tempo ride loop",
    type: "cycling",
    start_time: new Date().toISOString(),
    duration_seconds: 5400,
    distance_meters: 32000,
    average_heart_rate: 146,
    average_power: 225,
    provider: "garmin",
    elevation_gain_meters: 540,
    calories: 850,
    training_effect: "3.6 aerobic",
    description: "Sample detail placeholder while the API endpoint hydrates full telemetry.",
    route: {
      name: "River path",
      summary: "Rolling terrain with mid-ride surges",
      surface: "Paved",
    },
    metrics: [
      { label: "Moving time", value: "1:30:00", hint: "Includes neutral resets" },
      { label: "Normalized power", value: "248 W", hint: "Good repeatability" },
      { label: "Avg HR", value: "146 bpm", hint: "Z3 aerobic" },
    ],
  };
}
