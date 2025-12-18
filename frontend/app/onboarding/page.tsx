"use client";

import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";

const onboardingSteps = [
  {
    title: "Connect Garmin account",
    description: "Authenticate and enable activity sync.",
    status: "In progress",
    action: "Launch OAuth",
  },
  {
    title: "Set data cadence",
    description: "Choose sync frequency and caching preferences.",
    status: "Pending",
    action: "Select cadence",
  },
  {
    title: "Verify webhook",
    description: "Confirm event delivery from Garmin push service.",
    status: "Pending",
    action: "Send test event",
  },
];

const readinessChecks = [
  {
    label: "API base URL",
    value: "https://api.garmin.mock",
    state: "Configured",
  },
  {
    label: "Callback URL",
    value: "https://tracker.local/onboarding/callback",
    state: "Ready",
  },
  {
    label: "Notification channel",
    value: "Slack: #garmin-sync",
    state: "Optional",
  },
];

export default function OnboardingPage() {
  const completion = 45;

  return (
    <Container maxW="6xl" py={{ base: 8, md: 12 }}>
      <Stack spacing={8}>
        <Stack spacing={4} bg="surface" p={{ base: 6, md: 8 }} borderRadius="lg" shadow="sm" borderWidth="1px">
          <Flex direction={{ base: "column", md: "row" }} justify="space-between" gap={4}>
            <Stack spacing={2}>
              <Badge colorScheme="teal" w="fit-content" px={3} py={1} borderRadius="full">
                Guided onboarding
              </Badge>
              <Heading size={{ base: "lg", md: "xl" }}>Sync Garmin data in three steps.</Heading>
              <Text color="gray.600" _dark={{ color: "gray.300" }}>
                Follow the checklist to connect credentials, confirm delivery, and reach production readiness.
              </Text>
            </Stack>
            <Stack minW={{ base: "100%", md: "240px" }} spacing={3}>
              <Text fontWeight="medium">Progress</Text>
              <Progress value={completion} colorScheme="teal" borderRadius="full" aria-label="Onboarding progress" />
              <Text color="gray.600" _dark={{ color: "gray.300" }}>{completion}% complete</Text>
            </Stack>
          </Flex>
          <HStack spacing={3} wrap="wrap">
            <Button colorScheme="teal" size="lg">
              Resume onboarding
            </Button>
            <Button variant="outline" size="lg">
              View documentation
            </Button>
          </HStack>
        </Stack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
          {onboardingSteps.map((step) => (
            <Box
              key={step.title}
              p={6}
              borderWidth="1px"
              borderRadius="lg"
              bg="surface"
              shadow="sm"
              display="flex"
              flexDirection="column"
              gap={4}
            >
              <Stack spacing={2}>
                <Heading size="md">{step.title}</Heading>
                <Text color="gray.600" _dark={{ color: "gray.300" }}>
                  {step.description}
                </Text>
              </Stack>
              <HStack spacing={3}>
                <Badge colorScheme={step.status === "In progress" ? "teal" : "gray"} variant="subtle">
                  {step.status}
                </Badge>
                <Button size="sm" variant="ghost" colorScheme="teal">
                  {step.action}
                </Button>
              </HStack>
            </Box>
          ))}
        </SimpleGrid>

        <Flex direction={{ base: "column", lg: "row" }} gap={6} align="stretch">
          <Box flex={1} p={{ base: 6, md: 8 }} bg="surface" borderRadius="lg" borderWidth="1px" shadow="sm">
            <Stack spacing={4}>
              <Heading size="md">Environment readiness</Heading>
              <Text color="gray.600" _dark={{ color: "gray.300" }}>
                Confirm the values below before moving to production. These fixtures keep the layout stable while APIs land.
              </Text>
              <VStack align="stretch" spacing={4}>
                {readinessChecks.map((check) => (
                  <Box key={check.label} p={4} borderWidth="1px" borderRadius="md" bg="surface-muted">
                    <Flex justify="space-between" align="center" gap={3} wrap="wrap">
                      <Stack spacing={1}>
                        <Text fontWeight="medium">{check.label}</Text>
                        <Text color="gray.600" _dark={{ color: "gray.300" }} fontSize="sm">
                          {check.value}
                        </Text>
                      </Stack>
                      <Badge colorScheme="teal" variant="outline">
                        {check.state}
                      </Badge>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            </Stack>
          </Box>

          <Box flexBasis={{ base: "100%", lg: "360px" }} p={{ base: 6, md: 8 }} bg="surface" borderRadius="lg" borderWidth="1px" shadow="sm">
            <Stack spacing={4}>
              <Heading size="md">Support checklist</Heading>
              <Text color="gray.600" _dark={{ color: "gray.300" }}>
                Track optional items to make launch smoother.
              </Text>
              <Divider />
              <VStack align="stretch" spacing={3}>
                {["Create sandbox users", "Schedule load test", "Share rollback plan"].map((item) => (
                  <Flex key={item} justify="space-between" align="center" p={3} borderRadius="md" bg="surface-muted">
                    <Text>{item}</Text>
                    <Badge colorScheme="purple" variant="subtle">
                      Upcoming
                    </Badge>
                  </Flex>
                ))}
              </VStack>
            </Stack>
          </Box>
        </Flex>
      </Stack>
    </Container>
  );
}
