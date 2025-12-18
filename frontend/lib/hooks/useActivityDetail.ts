"use client";

import { useQuery } from "@tanstack/react-query";

import { buildMockActivityDetail, getActivityDetail } from "@/lib/api";

export const ACTIVITY_DETAIL_QUERY_KEY = "activity-detail";

export function useActivityDetail(activityId: string) {
  return useQuery({
    queryKey: [ACTIVITY_DETAIL_QUERY_KEY, activityId],
    queryFn: () => getActivityDetail(activityId),
    staleTime: 60_000,
    retry: 1,
    placeholderData: buildMockActivityDetail(activityId),
  });
}
