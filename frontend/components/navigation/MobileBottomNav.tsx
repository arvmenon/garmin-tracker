import NextLink from "next/link";
import { Box, HStack, Link, Text, useColorModeValue } from "@chakra-ui/react";

import type { NavItem } from "./DesktopSidebar";

interface MobileBottomNavProps {
  navItems: NavItem[];
}

export function MobileBottomNav({ navItems }: MobileBottomNavProps) {
  const surface = useColorModeValue("bg.surface", "gray.900");
  const border = useColorModeValue("border.subtle", "border.emphasis");
  const muted = useColorModeValue("gray.600", "gray.300");

  return (
    <Box
      as="nav"
      aria-label="Primary"
      position="sticky"
      bottom={0}
      left={0}
      right={0}
      bg={surface}
      borderTopWidth="1px"
      borderColor={border}
      display={{ base: "block", lg: "none" }}
      zIndex={10}
      px={3}
      py={2}
    >
      <HStack spacing={2} justify="space-between">
        {navItems.map((item) => (
          <Link
            key={item.label}
            as={NextLink}
            href={item.href}
            flex={1}
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={1}
            px={3}
            py={2}
            borderRadius="md"
            textDecoration="none"
            _hover={{ bg: "bg.surface-muted" }}
            _focusVisible={{ boxShadow: "outline", bg: "bg.surface-muted" }}
          >
            <Box bg="accent.strong" h={2} w={2} borderRadius="full" aria-hidden />
            <Text fontSize="xs" color={muted} fontWeight="semibold">
              {item.label}
            </Text>
          </Link>
        ))}
      </HStack>
    </Box>
  );
}
