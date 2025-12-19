import NextLink from "next/link";
import {
  Box,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

interface DesktopSidebarProps {
  navItems: NavItem[];
}

export function DesktopSidebar({ navItems }: DesktopSidebarProps) {
  const muted = useColorModeValue("gray.600", "gray.300");

  return (
    <Box
      as="nav"
      aria-label="Primary"
      display={{ base: "none", lg: "block" }}
      w={{ lg: 64 }}
      borderRightWidth="1px"
      borderColor="border.subtle"
      bg="bg.surface"
      px={6}
      py={8}
    >
      <Flex direction="column" gap={10} height="100%">
        <Box>
          <Heading size="md">Garmin Tracker</Heading>
          <Text color={muted} mt={2} fontSize="sm">
            Insights, sync status, and coaching-ready moments.
          </Text>
        </Box>

        <Stack spacing={2} as="ul" listStyleType="none" padding={0} margin={0} flex={1}>
          {navItems.map((item) => (
            <Box key={item.label} as="li">
              <Link
                as={NextLink}
                href={item.href}
                display="block"
                px={3}
                py={3}
                borderRadius="md"
                transition="background-color var(--app-transition-fast) ease"
                _hover={{ bg: "bg.surface-muted" }}
                _focusVisible={{ boxShadow: "outline", bg: "bg.surface-muted" }}
              >
                <Text fontWeight="semibold">{item.label}</Text>
                {item.description ? (
                  <Text mt={1} color={muted} fontSize="sm">
                    {item.description}
                  </Text>
                ) : null}
              </Link>
            </Box>
          ))}
        </Stack>

        <Box
          p={4}
          borderRadius="md"
          bg="bg.surface-muted"
          borderWidth="1px"
          borderColor="border.subtle"
        >
          <Heading size="sm">Reduced motion ready</Heading>
          <Text mt={2} color={muted} fontSize="sm">
            Focus rings, tokens, and transitions respect system preferences and wireframe specs.
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}
