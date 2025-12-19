"use client";

import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";

import { RuntimeHealthCard } from "@/components/admin/RuntimeHealthCard";

const adminAreas = [
  {
    title: "User access",
    description: "Review athlete and coach accounts, manage roles, and resend invitations.",
    action: "Review users",
  },
  {
    title: "Provider credentials",
    description: "Rotate Garmin OAuth credentials and verify webhook status.",
    action: "Manage providers",
  },
  {
    title: "Sync monitoring",
    description: "Track webhook ingestion, retries, and background job health.",
    action: "View sync health",
  },
  {
    title: "Audit logs",
    description: "Search privileged actions with context and justification trails.",
    action: "Open audit logs",
  },
];

export default function AdminPage() {
  return (
    <Container maxW="6xl" py={{ base: 8, md: 12 }}>
      <Stack spacing={8}>
        <Flex direction={{ base: "column", md: "row" }} justify="space-between" gap={4} align={{ base: "flex-start", md: "center" }}>
          <Stack spacing={2}>
            <Badge colorScheme="purple" w="fit-content" px={3} py={1} borderRadius="full">
              Admin
            </Badge>
            <Heading size={{ base: "lg", md: "xl" }}>Platform control center.</Heading>
            <Text color="text.muted" maxW="3xl">
              Centralize provider configuration, sync monitoring, and access oversight for Garmin-first operations.
            </Text>
          </Stack>
          <HStack spacing={3} wrap="wrap">
            <Button colorScheme="purple">Create admin note</Button>
            <Button variant="outline">Export audit log</Button>
          </HStack>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <RuntimeHealthCard />
          <Box p={{ base: 6, md: 8 }} borderWidth="1px" borderRadius="lg" bg="surface" shadow="sm">
            <Stack spacing={3}>
              <Heading size="md">Ops snapshot</Heading>
              <Text color="text.muted">
                Review sync stability, manual retries, and queued webhook volume before adjusting provider settings.
              </Text>
              <Button alignSelf="flex-start" variant="ghost" colorScheme="purple">
                View ops report
              </Button>
            </Stack>
          </Box>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {adminAreas.map((area) => (
            <Box key={area.title} p={{ base: 6, md: 8 }} borderWidth="1px" borderRadius="lg" bg="surface" shadow="sm">
              <Stack spacing={4}>
                <Heading size="md">{area.title}</Heading>
                <Text color="text.muted">{area.description}</Text>
                <Button alignSelf="flex-start" variant="ghost" colorScheme="purple">
                  {area.action}
                </Button>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
