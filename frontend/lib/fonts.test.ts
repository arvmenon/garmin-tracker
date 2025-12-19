import type { CSSProperties } from "react";
import { describe, expect, expectTypeOf, it } from "vitest";

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

  it("exposes both Geist font variables", () => {
    expect(Object.keys(fontVariableStyle)).toEqual(
      expect.arrayContaining(["--font-geist-sans", "--font-geist-mono"]),
    );
  });

  it("remains compatible with React CSSProperties", () => {
    expectTypeOf(fontVariableStyle).toMatchTypeOf<CSSProperties>();
  });
});
