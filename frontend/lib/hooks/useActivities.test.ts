import { describe, expect, it, vi } from "vitest";
import { useQuery } from "@tanstack/react-query";

import { getActivities } from "@/lib/api";
import { ACTIVITIES_QUERY_KEY, useActivities } from "@/lib/hooks/useActivities";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

vi.mock("@/lib/api", () => ({
  getActivities: vi.fn(),
}));

const useQueryMock = vi.mocked(useQuery);
const getActivitiesMock = vi.mocked(getActivities);

describe("useActivities", () => {
  it("configures the activities query and delegates to the API helper", async () => {
    const params = { page: 2, pageSize: 5, type: "running" };
    const queryResult = {
      data: {
        items: [],
        count: 0,
        page: 2,
        pageSize: 5,
        hasMore: false,
      },
    };
    useQueryMock.mockReturnValue(queryResult as ReturnType<typeof useActivities>);

    const result = useActivities(params);
    expect(result).toBe(queryResult);

    expect(useQueryMock).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [ACTIVITIES_QUERY_KEY, params],
        keepPreviousData: true,
        staleTime: 60_000,
        refetchInterval: 120_000,
      }),
    );

    const queryOptions = useQueryMock.mock.calls[0]?.[0];
    await queryOptions.queryFn();
    expect(getActivitiesMock).toHaveBeenCalledWith(params);
  });
});
