import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import AdminPage from "./page";

describe("Admin page", () => {
  it("renders the runtime health widget", () => {
    const queryClient = new QueryClient();
    const html = renderToString(
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <AdminPage />
        </ChakraProvider>
      </QueryClientProvider>,
    );

    expect(html).toContain("Runtime health");
  });
});
