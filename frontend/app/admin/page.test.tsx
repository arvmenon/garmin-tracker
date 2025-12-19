import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import AdminPage from "./page";

describe("Admin page", () => {
  it("renders the admin control center content", () => {
    const html = renderToString(
      <ChakraProvider>
        <AdminPage />
      </ChakraProvider>,
    );

    expect(html).toContain("Platform control center.");
  });
});
