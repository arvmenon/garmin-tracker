"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { ActivitiesQueryParams, ApiError, getActivities } from "@/lib/api";
import { ActivitySummary, PaginatedResult } from "@/lib/types";

export const ACTIVITIES_QUERY_KEY = "activities";

export function useActivities(params: ActivitiesQueryParams): UseQueryResult<PaginatedResult<ActivitySummary>, ApiError> {
  return useQuery<PaginatedResult<ActivitySummary>, ApiError>({
    queryKey: [ACTIVITIES_QUERY_KEY, params],
    queryFn: () => getActivities(params),
    keepPreviousData: true,
    staleTime: 60_000,
    refetchInterval: 120_000,
  });
}
