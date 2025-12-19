import type { CSSProperties } from "react";

export const fontFamilies = {
  sans: '"Geist Sans", "Inter", system-ui, -apple-system, sans-serif',
  mono: '"Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
};

export const fontVariableStyle: CSSProperties = {
  "--font-geist-sans": fontFamilies.sans,
  "--font-geist-mono": fontFamilies.mono,
};
