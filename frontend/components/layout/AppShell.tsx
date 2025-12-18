"use client";

import { ReactNode } from "react";
import { Box, Flex, Heading, HStack, Stack, Text, useColorModeValue } from "@chakra-ui/react";

import ColorModeToggle from "@/components/navigation/ColorModeToggle";
import { DesktopSidebar, type NavItem } from "@/components/navigation/DesktopSidebar";
import { MobileBottomNav } from "@/components/navigation/MobileBottomNav";

const navItems: NavItem[] = [
  { label: "Overview", href: "/", description: "Wireframe-ready dashboard shell" },
  { label: "Activities", href: "/activities", description: "Filters, pagination, and detail" },
  { label: "Comparisons", href: "/#comparisons", description: "Trends and goals" },
  { label: "Settings", href: "/#settings", description: "Connections and alerts" },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const headerBorder = useColorModeValue("border.subtle", "border.emphasis");
  const muted = useColorModeValue("gray.600", "gray.300");

  return (
    <Flex minH="100vh" bg="bg.canvas" color="text.primary">
      <DesktopSidebar navItems={navItems} />
      <Flex direction="column" flex={1} minW={0}>
        <Box
          as="header"
          borderBottomWidth="1px"
          borderColor={headerBorder}
          bg="bg.surface"
          px={{ base: 4, md: 8 }}
          py={{ base: 4, md: 5 }}
          position="sticky"
          top={0}
          zIndex={5}
        >
          <HStack justify="space-between" spacing={{ base: 4, md: 8 }}>
            <Stack spacing={1}>
              <Heading size="md">Garmin activity tracker</Heading>
              <Text color={muted} fontSize="sm">
                Color-safe focus rings, responsive navigation, and motion-aware defaults.
              </Text>
            </Stack>
            <ColorModeToggle />
          </HStack>
        </Box>

        <Flex as="main" flex={1} px={{ base: 4, md: 8 }} py={{ base: 6, md: 10 }} minH={0}>
          <Box width="full" pb={{ base: 16, lg: 0 }} id="overview">
            {children}
          </Box>
        </Flex>

        <MobileBottomNav navItems={navItems} />
      </Flex>
    </Flex>
  );
}
