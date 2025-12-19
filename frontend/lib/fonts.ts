import type { CSSProperties } from "react";

export const fontFamilies = {
  sans: '"Geist Sans", "Inter", system-ui, -apple-system, sans-serif',
  mono: '"Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
};

type FontVariableName = "--font-geist-sans" | "--font-geist-mono";

export type FontVariableStyle = CSSProperties & Record<FontVariableName, string>;

export const fontVariableStyle = {
  "--font-geist-sans": fontFamilies.sans,
  "--font-geist-mono": fontFamilies.mono,
} satisfies FontVariableStyle;
