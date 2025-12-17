import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: "var(--font-geist-sans, 'Inter', system-ui, -apple-system, sans-serif)",
    body: "var(--font-geist-sans, 'Inter', system-ui, -apple-system, sans-serif)",
    mono: "var(--font-geist-mono, 'SFMono-Regular', Menlo, monospace)",
  },
  radii: {
    md: "12px",
    lg: "16px",
  },
  styles: {
    global: {
      "*, *::before, *::after": {
        borderColor: "gray.200",
        _dark: { borderColor: "gray.700" },
      },
      body: {
        bg: { base: "gray.50", _dark: "gray.900" },
        color: { base: "gray.900", _dark: "gray.50" },
        transitionProperty: "background-color, color",
        transitionDuration: "150ms",
      },
      ":focus-visible": {
        outline: "2px solid",
        outlineColor: "teal.400",
        outlineOffset: "2px",
      },
    },
  },
  shadows: {
    outline: "0 0 0 2px var(--chakra-colors-teal-400)",
  },
  semanticTokens: {
    colors: {
      surface: {
        default: "white",
        _dark: "gray.800",
      },
      "surface-muted": {
        default: "gray.50",
        _dark: "gray.900",
      },
    },
  },
});

export default theme;
