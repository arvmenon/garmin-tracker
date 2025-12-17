"use client";

import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Progress,
  SimpleGrid,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";

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
            <Text color="gray.600" _dark={{ color: "gray.300" }} fontSize="lg">
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
            bg="surface"
            borderRadius="lg"
            shadow="md"
            p={6}
            flexBasis={{ base: "100%", md: "360px" }}
            borderWidth="1px"
            borderColor="gray.100"
            _dark={{ borderColor: "gray.700" }}
          >
            <Stack spacing={4}>
              <Heading size="md">Runtime health</Heading>
              <Progress value={82} colorScheme="teal" borderRadius="full" aria-label="Runtime readiness" />
              <Stack spacing={3}>
                {stats.map((stat) => (
                  <Stat key={stat.label}>
                    <StatLabel color="gray.500" _dark={{ color: "gray.400" }}>
                      {stat.label}
                    </StatLabel>
                    <StatNumber>{stat.value}</StatNumber>
                    <StatHelpText color="gray.500" _dark={{ color: "gray.400" }}>
                      {stat.detail}
                    </StatHelpText>
                  </Stat>
                ))}
              </Stack>
            </Stack>
          </Box>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
          {accelerators.map((item) => (
            <Box
              key={item.title}
              p={6}
              bg="surface"
              borderRadius="md"
              shadow="sm"
              borderWidth="1px"
              borderColor="gray.100"
              _dark={{ borderColor: "gray.700" }}
            >
              <Stack spacing={3}>
                <Heading size="md">{item.title}</Heading>
                <Text color="gray.600" _dark={{ color: "gray.300" }}>
                  {item.description}
                </Text>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>

        <Box
          p={{ base: 6, md: 8 }}
          borderRadius="lg"
          bg="surface-muted"
          borderWidth="1px"
          borderColor="gray.100"
          _dark={{ borderColor: "gray.700" }}
        >
          <Stack direction={{ base: "column", md: "row" }} spacing={6} justify="space-between" align="center">
            <VStack align="flex-start" spacing={3}>
              <Heading size="md">Next steps</Heading>
              <Text color="gray.600" _dark={{ color: "gray.300" }}>
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
    </Container>
  );
}
