"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { ActivitiesQueryParams, ApiError, getActivities } from "@/lib/api";
import { ActivitySummary, PaginatedResult } from "@/lib/types";

export const ACTIVITIES_QUERY_KEY = "activities";

export function useActivities(params: ActivitiesQueryParams) {
  return useQuery<PaginatedResult<ActivitySummary>, ApiError>({
    queryKey: [ACTIVITIES_QUERY_KEY, params],
    queryFn: () => getActivities(params),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
    refetchInterval: 120_000,
  });
}
