"use client";

import { IconButton, Tooltip, useColorMode } from "@chakra-ui/react";

export default function ColorModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();

  const isDark = colorMode === "dark";

  return (
    <Tooltip
      label={`Switch to ${isDark ? "light" : "dark"} mode`}
      placement="bottom"
      borderRadius="md"
    >
      <IconButton
        aria-label="Toggle color mode"
        icon={<span aria-hidden>{isDark ? "🌙" : "☀️"}</span>}
        variant="ghost"
        onClick={toggleColorMode}
        size="sm"
        borderRadius="full"
      />
    </Tooltip>
  );
}
