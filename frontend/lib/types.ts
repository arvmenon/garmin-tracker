export interface ActivitySummary {
  id: string;
  type: string;
  start_time: string;
  duration_seconds: number;
  distance_meters?: number;
  average_heart_rate?: number;
  average_power?: number;
  provider: string;
}

export interface ActivityDetail extends ActivitySummary {
  title?: string;
  description?: string;
  elevation_gain_meters?: number;
  calories?: number;
  training_effect?: string;
  route?: {
    name?: string;
    summary?: string;
    surface?: string;
  };
  metrics?: Array<{ label: string; value: string; hint?: string }>;
}

export interface SyncStatus {
  status: string;
  app: string;
  environment: string;
  timestamp: string;
}

export interface PaginatedResult<T> {
  items: T[];
  count: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
