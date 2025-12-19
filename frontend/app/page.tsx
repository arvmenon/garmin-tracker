"use client";

import React from "react";
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Progress,
  Divider,
  SimpleGrid,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";
import { EmptyState } from "@/components/feedback/EmptyState";
import { SyncStatusCard } from "@/components/sync/SyncStatusCard";

const stats = [
  { label: "Sync latency", value: "<150ms", detail: "cached fetch + SWR" },
  { label: "UI thread work", value: "1.2ms", detail: "lightweight theming" },
  { label: "Bundle focus", value: "zero CSS-in-JS reset", detail: "Chakra only" },
];

const accelerators = [
  {
    title: "Performance-first defaults",
    description:
      "Optimized Chakra baseline with reduced motion-safe styles, sharp focus rings, and minimal global CSS for fast paints.",
  },
  {
    title: "API ready",
    description:
      "Point NEXT_PUBLIC_API_BASE_URL at the FastAPI server and start streaming Garmin metrics into responsive cards and charts.",
  },
  {
    title: "Port 4010",
    description: "Local dev and production start scripts pin the UI to port 4010 for predictable docker-compose wiring.",
  },
];

export default function Home() {
  return (
    <Container maxW="6xl" py={{ base: 8, md: 16 }}>
      <Stack spacing={12}>
        <Box as="section" id="overview">
          <Stack spacing={10}>
            <Flex
              align={{ base: "flex-start", md: "center" }}
              direction={{ base: "column", md: "row" }}
              gap={{ base: 8, md: 10 }}
            >
              <Stack spacing={5} flex={1}>
                <Badge colorScheme="teal" w="fit-content" px={3} py={1} borderRadius="full">
                  Garmin Tracker UI
                </Badge>
                <Heading size={{ base: "lg", md: "xl" }}>
                  Speed-focused scaffold for dashboards, comparisons, and sync status.
                </Heading>
                <Text color="text.muted" fontSize="lg">
                  Bootstrapped with Chakra UI for fast rendering, accessible defaults, and smooth hand-off to Garmin APIs.
                </Text>
                <HStack spacing={4} wrap="wrap">
                  <Button colorScheme="teal" size="lg">
                    Open dashboard shell
                  </Button>
                  <Button variant="ghost" size="lg">
                    Configure API target
                  </Button>
                </HStack>
              </Stack>
              <Box
                bg="bg.surface"
                borderRadius="lg"
                shadow="card"
                p={6}
                flexBasis={{ base: "100%", md: "360px" }}
                borderWidth="1px"
                borderColor="border.subtle"
              >
                <Stack spacing={4}>
                  <Heading size="md">Runtime health</Heading>
                  <Progress value={82} colorScheme="teal" borderRadius="full" aria-label="Runtime readiness" />
                  <Stack spacing={3}>
                    {stats.map((stat) => (
                      <Stat key={stat.label}>
                        <StatLabel color="text.muted">{stat.label}</StatLabel>
                        <StatNumber>{stat.value}</StatNumber>
                        <StatHelpText color="text.muted">{stat.detail}</StatHelpText>
                      </Stat>
                    ))}
                  </Stack>
                  <SyncStatusCard />
                </Stack>
              </Box>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
              {accelerators.map((item) => (
                <Box
                  key={item.title}
                  p={6}
                  bg="bg.surface"
                  borderRadius="md"
                  shadow="card"
                  borderWidth="1px"
                  borderColor="border.subtle"
                >
                  <Stack spacing={3}>
                    <Heading size="md">{item.title}</Heading>
                    <Text color="text.muted">{item.description}</Text>
                  </Stack>
                </Box>
              ))}
            </SimpleGrid>
          </Stack>
        </Box>

        <Stack spacing={8} as="section" id="activities">
          <Stack spacing={3}>
            <Heading size="lg">Activities</Heading>
            <Text color="text.muted">Recent Garmin syncs render here with the motion-safe theme.</Text>
          </Stack>
          <Box
            p={{ base: 6, md: 8 }}
            borderRadius="lg"
            bg="bg.surface-muted"
            borderWidth="1px"
            borderColor="border.subtle"
          >
            <Stack direction={{ base: "column", md: "row" }} spacing={6} justify="space-between" align="center">
              <VStack align="flex-start" spacing={3}>
                <Heading size="md">Next steps</Heading>
                <Text color="text.muted">
                  Wire the API client, add dashboard routes, and keep the UI lean. The stack is ready for rapid iteration.
                </Text>
              </VStack>
              <HStack spacing={3}>
                <Badge colorScheme="purple" variant="subtle" px={3} py={1} borderRadius="full">
                  Optimized
                </Badge>
                <Badge colorScheme="green" variant="subtle" px={3} py={1} borderRadius="full">
                  Accessible
                </Badge>
                <Badge colorScheme="blue" variant="subtle" px={3} py={1} borderRadius="full">
                  Ready on :4010
                </Badge>
              </HStack>
            </Stack>
          </Box>
        </Stack>

        <Stack spacing={8} as="section" id="comparisons">
          <Stack spacing={3}>
            <Heading size="lg">Comparisons</Heading>
            <Text color="text.muted">Use semantic tokens to keep charts readable in any mode.</Text>
          </Stack>
          <Divider />
          <EmptyState
            title="No comparison data yet"
            description="Connect Garmin and set at least two time ranges to unlock trend comparisons and PR tracking."
            actionLabel="Connect Garmin"
          />
        </Stack>

        <Stack spacing={8} as="section" id="settings">
          <Stack spacing={3}>
            <Heading size="lg">Settings</Heading>
            <Text color="text.muted">
              Configure sync cadence, focus indicators, and reduced motion preferences from one place.
            </Text>
          </Stack>
          <Box
            p={{ base: 6, md: 8 }}
            borderRadius="lg"
            bg="bg.surface"
            borderWidth="1px"
            borderColor="border.subtle"
            shadow="card"
          >
            <Stack spacing={4}>
              <Heading size="md">Interface controls</Heading>
              <Text color="text.muted">
                Color mode toggles, motion reduction tokens, and focus ring styling live at the layout level for consistency.
              </Text>
              <HStack spacing={3} wrap="wrap">
                <Badge colorScheme="teal" variant="outline" px={3} py={1} borderRadius="full">
                  Motion aware
                </Badge>
                <Badge colorScheme="gray" variant="outline" px={3} py={1} borderRadius="full">
                  Tokenized
                </Badge>
                <Badge colorScheme="green" variant="outline" px={3} py={1} borderRadius="full">
                  Accessible focus
                </Badge>
              </HStack>
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
}
