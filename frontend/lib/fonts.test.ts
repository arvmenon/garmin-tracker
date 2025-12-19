import { describe, expect, it } from "vitest";

import { fontFamilies, fontVariableStyle } from "./fonts";

describe("fontFamilies", () => {
  it("defines Geist font stacks", () => {
    expect(fontFamilies.sans).toContain("Geist Sans");
    expect(fontFamilies.mono).toContain("Geist Mono");
  });
});

describe("fontVariableStyle", () => {
  it("maps font variables to the configured stacks", () => {
    expect(fontVariableStyle["--font-geist-sans"]).toBe(fontFamilies.sans);
    expect(fontVariableStyle["--font-geist-mono"]).toBe(fontFamilies.mono);
  });
});
