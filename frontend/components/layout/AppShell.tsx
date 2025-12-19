"use client";

import { ReactNode } from "react";
import { Box, Flex, Heading, HStack, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { FiSettings } from "react-icons/fi";

import ColorModeToggle from "@/components/navigation/ColorModeToggle";
import { type NavItem, TopNav } from "@/components/navigation/TopNav";

const navItems: NavItem[] = [
  { label: "Overview", href: "/" },
  { label: "Activities", href: "/activities" },
  { label: "Comparisons", href: "/compare" },
  { label: "Devices", href: "/devices" },
  { label: "Admin", href: "/admin" },
  { label: "Settings", href: "/settings", icon: FiSettings },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const headerBorder = useColorModeValue("border.subtle", "border.emphasis");
  const muted = useColorModeValue("gray.600", "gray.300");

  return (
    <Flex minH="100vh" bg="bg.canvas" color="text.primary" direction="column">
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
        <Stack spacing={{ base: 4, md: 5 }}>
          <HStack justify="space-between" spacing={{ base: 4, md: 8 }}>
            <Stack spacing={1}>
              <Heading size="md">Garmin activity tracker</Heading>
              <Text color={muted} fontSize="sm">
                Color-safe focus rings, responsive navigation, and motion-aware defaults.
              </Text>
            </Stack>
            <ColorModeToggle />
          </HStack>
          <TopNav navItems={navItems} />
        </Stack>
      </Box>

      <Flex as="main" flex={1} px={{ base: 4, md: 8 }} py={{ base: 6, md: 10 }} minH={0}>
        <Box width="full" id="overview">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}
