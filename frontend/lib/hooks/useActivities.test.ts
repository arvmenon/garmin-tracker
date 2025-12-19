import { describe, expect, it, vi } from "vitest";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getActivities } from "@/lib/api";
import { ACTIVITIES_QUERY_KEY, useActivities } from "@/lib/hooks/useActivities";

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

vi.mock("@/lib/api", () => ({
  getActivities: vi.fn(),
}));

const useQueryMock = vi.mocked(useQuery);
const getActivitiesMock = vi.mocked(getActivities);

describe("useActivities", () => {
  it("configures the activities query and delegates to the API helper", async () => {
    const params = { page: 2, pageSize: 5, type: "running" };
    const apiResponse = {
      items: [],
      count: 0,
      page: 2,
      pageSize: 5,
      hasMore: false,
    };
    const queryResult = {
      data: apiResponse,
    };
    useQueryMock.mockReturnValue(queryResult as ReturnType<typeof useActivities>);
    getActivitiesMock.mockResolvedValue(apiResponse);

    const result = useActivities(params);
    expect(result).toBe(queryResult);

    expect(useQueryMock).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [ACTIVITIES_QUERY_KEY, params],
        placeholderData: keepPreviousData,
        staleTime: 60_000,
        refetchInterval: 120_000,
      }),
    );

    const queryOptions = useQueryMock.mock.calls[0]?.[0];
    await expect(queryOptions.queryFn()).resolves.toBe(apiResponse);
    expect(getActivitiesMock).toHaveBeenCalledWith(params);
  });

  it("uses the provided params when constructing the query key", () => {
    const params = { page: 1, pageSize: 10, provider: "garmin" };
    const queryResult = { data: undefined };
    useQueryMock.mockReturnValue(queryResult as ReturnType<typeof useActivities>);

    const result = useActivities(params);

    expect(result).toBe(queryResult);
    expect(useQueryMock).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [ACTIVITIES_QUERY_KEY, params],
      }),
    );
  });
});
