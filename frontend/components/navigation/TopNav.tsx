import NextLink from "next/link";
import { Box, HStack, Icon, Link, Text, useColorModeValue } from "@chakra-ui/react";
import type { IconType } from "react-icons";

export type NavItem = {
  label: string;
  href: string;
  icon?: IconType;
};

interface TopNavProps {
  navItems: NavItem[];
}

export function TopNav({ navItems }: TopNavProps) {
  const muted = useColorModeValue("gray.600", "gray.300");

  return (
    <Box as="nav" aria-label="Primary">
      <HStack
        spacing={{ base: 3, md: 5 }}
        wrap="wrap"
        align="center"
        justify={{ base: "flex-start", md: "space-between" }}
      >
        {navItems.map((item) => (
          <Link
            key={item.label}
            as={NextLink}
            href={item.href}
            display="inline-flex"
            alignItems="center"
            gap={2}
            px={3}
            py={2}
            borderRadius="md"
            transition="background-color var(--app-transition-fast) ease"
            _hover={{ bg: "bg.surface-muted", color: "text.primary" }}
            _focusVisible={{ boxShadow: "outline", bg: "bg.surface-muted" }}
          >
            {item.icon ? <Icon as={item.icon} boxSize={4} color={muted} /> : null}
            <Text fontWeight="semibold" color="text.primary">
              {item.label}
            </Text>
          </Link>
        ))}
      </HStack>
    </Box>
  );
}
