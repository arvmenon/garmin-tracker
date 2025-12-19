import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import DevicesPage from "./page";

describe("Devices page", () => {
  it("renders device fleet content", () => {
    const html = renderToString(
      <ChakraProvider>
        <DevicesPage />
      </ChakraProvider>,
    );

    expect(html).toContain("Track your hardware fleet.");
  });
});
