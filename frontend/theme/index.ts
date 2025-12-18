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
  fontSizes: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "28px",
  },
  radii: {
    sm: "6px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    full: "9999px",
  },
  colors: {
    brand: {
      50: "#e5f4ff",
      100: "#cce7ff",
      200: "#99d0ff",
      300: "#66b9ff",
      400: "#339fff",
      500: "#0f7bff",
      600: "#0c62cc",
      700: "#094a99",
      800: "#063166",
      900: "#041933",
    },
    moss: {
      50: "#edf7f2",
      100: "#d0e9dc",
      200: "#a1d3ba",
      300: "#73bc98",
      400: "#44a676",
      500: "#2b8d5d",
      600: "#1f6e48",
      700: "#155033",
      800: "#0a3120",
      900: "#04190f",
    },
  },
  styles: {
    global: {
      "*, *::before, *::after": {
        borderColor: "border.subtle",
      },
      body: {
        bg: "bg.canvas",
        color: "text.primary",
        transitionProperty: "background-color, color",
        transitionDuration: "var(--app-transition-fast)",
        transitionTimingFunction: "ease",
        lineHeight: "1.6",
      },
      ":focus-visible": {
        outline: "3px solid",
        outlineColor: "accent.focus",
        outlineOffset: "2px",
      },
      "@media (prefers-reduced-motion: reduce)": {
        "*": {
          animationDuration: "0.001ms !important",
          animationIterationCount: "1 !important",
          transitionDuration: "0.001ms !important",
          scrollBehavior: "auto !important",
        },
        body: {
          transitionDuration: "0ms",
        },
      },
      ":root": {
        "--app-transition-fast": "150ms",
        "--app-transition-slow": "250ms",
      },
    },
  },
  shadows: {
    outline: "0 0 0 3px var(--chakra-colors-accent-focus)",
    raised: "0px 10px 30px rgba(12, 20, 38, 0.08)",
  },
  semanticTokens: {
    colors: {
      "bg.canvas": { default: "gray.50", _dark: "gray.900" },
      "bg.surface": { default: "white", _dark: "gray.800" },
      "bg.surface-muted": { default: "gray.100", _dark: "gray.700" },
      "border.subtle": { default: "gray.200", _dark: "gray.700" },
      "border.emphasis": { default: "gray.300", _dark: "gray.600" },
      "text.primary": { default: "gray.900", _dark: "gray.50" },
      "text.muted": { default: "gray.600", _dark: "gray.300" },
      "accent.focus": { default: "brand.500", _dark: "brand.300" },
      "accent.strong": { default: "moss.500", _dark: "moss.300" },
    },
    shadows: {
      card: "0 8px 24px rgba(0, 0, 0, 0.06)",
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "semibold",
        borderRadius: "md",
        transitionProperty: "background-color, color, box-shadow",
        transitionDuration: "var(--app-transition-fast)",
      },
      defaultProps: {
        colorScheme: "brand",
      },
    },
    Card: {
      baseStyle: {
        bg: "bg.surface",
        borderWidth: "1px",
        borderColor: "border.subtle",
        shadow: "card",
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: "md",
          _focusVisible: {
            borderColor: "accent.focus",
            boxShadow: "0 0 0 3px var(--chakra-colors-accent-focus)",
          },
        },
      },
    },
  },
});

export default theme;
