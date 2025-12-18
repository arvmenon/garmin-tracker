"use client";

import { useQuery } from "@tanstack/react-query";

import { getSyncStatus } from "@/lib/api";

export const SYNC_STATUS_QUERY_KEY = "sync-status";

export function useSyncStatus() {
  return useQuery({
    queryKey: [SYNC_STATUS_QUERY_KEY],
    queryFn: getSyncStatus,
    refetchInterval: 30_000,
    staleTime: 30_000,
  });
}
