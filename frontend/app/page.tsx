"use client";

import {
  Badge,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";

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
            <Stack spacing={5}>
              <Badge colorScheme="teal" w="fit-content" px={3} py={1} borderRadius="full">
                Garmin Tracker UI
              </Badge>
              <Heading size={{ base: "lg", md: "xl" }}>
                Speed-focused scaffold for dashboards, activities, and sync status.
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
              <Stack align="flex-start" spacing={3}>
                <Heading size="md">Next steps</Heading>
                <Text color="text.muted">
                  Wire the API client, add dashboard routes, and keep the UI lean. The stack is ready for rapid iteration.
                </Text>
              </Stack>
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

      </Stack>
    </Container>
  );
}
