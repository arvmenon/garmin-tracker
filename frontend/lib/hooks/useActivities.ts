"use client";

import { useQuery } from "@tanstack/react-query";

import { ActivitiesQueryParams, getActivities } from "@/lib/api";

export const ACTIVITIES_QUERY_KEY = "activities";

export function useActivities(params: ActivitiesQueryParams) {
  return useQuery({
    queryKey: [ACTIVITIES_QUERY_KEY, params],
    queryFn: () => getActivities(params),
    keepPreviousData: true,
    staleTime: 60_000,
    refetchInterval: 120_000,
  });
}
