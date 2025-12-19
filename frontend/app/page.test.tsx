import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import Home from "./page";

describe("Home page", () => {
  it("renders without throwing", () => {
    const queryClient = new QueryClient();
    const html = renderToString(
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <Home />
        </ChakraProvider>
      </QueryClientProvider>,
    );

    expect(html).toContain("Garmin Tracker UI");
  });
});
