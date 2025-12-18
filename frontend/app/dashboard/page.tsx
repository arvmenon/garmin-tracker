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
  Icon,
  SimpleGrid,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiActivity, FiClock, FiTrendingUp } from "react-icons/fi";

const heroStats = [
  { label: "Activities this week", value: "12", detail: "+3 vs last week", icon: FiActivity },
  { label: "Avg. training load", value: "745", detail: "steady", icon: FiTrendingUp },
  { label: "Time in zone", value: "5h 12m", detail: "goal: 6h", icon: FiClock },
];

const activityFeed = [
  { id: "a1", name: "Morning Ride", distance: "32 km", time: "58:44", intensity: "Tempo" },
  { id: "a2", name: "Recovery Run", distance: "6.4 km", time: "34:12", intensity: "Recovery" },
  { id: "a3", name: "Swim Laps", distance: "1.8 km", time: "42:05", intensity: "Endurance" },
  { id: "a4", name: "Evening Ride", distance: "28 km", time: "52:10", intensity: "Tempo" },
];

const weeklyTrends = [
  { label: "VO2 max", value: "54 ml/kg/min", delta: "+0.3" },
  { label: "HRV", value: "74 ms", delta: "+2" },
  { label: "Resting HR", value: "48 bpm", delta: "-1" },
];

export default function DashboardPage() {
  return (
    <Container maxW="6xl" py={{ base: 8, md: 12 }}>
      <Stack spacing={8}>
        <Stack
          bg="surface"
          p={{ base: 6, md: 8 }}
          borderRadius="lg"
          borderWidth="1px"
          shadow="sm"
          spacing={5}
        >
          <Flex direction={{ base: "column", md: "row" }} justify="space-between" gap={4}>
            <Stack spacing={2}>
              <Badge colorScheme="teal" w="fit-content" px={3} py={1} borderRadius="full">
                Dashboard
              </Badge>
              <Heading size={{ base: "lg", md: "xl" }}>Your Garmin performance snapshot.</Heading>
              <Text color="gray.600" _dark={{ color: "gray.300" }}>
                Static fixtures stand in for charts and metrics until API wiring is complete.
              </Text>
            </Stack>
            <HStack spacing={3} wrap="wrap">
              <Button colorScheme="teal" size="lg">
                Start new activity
              </Button>
              <Button variant="outline" size="lg">
                Export report
              </Button>
            </HStack>
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
            {heroStats.map((stat) => (
              <Box key={stat.label} p={5} borderWidth="1px" borderRadius="lg" bg="surface-muted">
                <HStack spacing={4} align="flex-start">
                  <Box
                    w={10}
                    h={10}
                    borderRadius="full"
                    bg="teal.50"
                    _dark={{ bg: "teal.900" }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={stat.icon} color="teal.500" />
                  </Box>
                  <Stack spacing={1}>
                    <Stat>
                      <StatLabel>{stat.label}</StatLabel>
                      <StatNumber>{stat.value}</StatNumber>
                      <StatHelpText>{stat.detail}</StatHelpText>
                    </Stat>
                  </Stack>
                </HStack>
              </Box>
            ))}
          </SimpleGrid>
        </Stack>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <Box p={{ base: 6, md: 8 }} bg="surface" borderRadius="lg" borderWidth="1px" shadow="sm">
            <Stack spacing={4}>
              <Flex justify="space-between" align="center">
                <Heading size="md">Weekly output</Heading>
                <Badge colorScheme="purple" variant="subtle">
                  Chart placeholder
                </Badge>
              </Flex>
              <Box
                borderWidth="1px"
                borderStyle="dashed"
                borderRadius="md"
                minH="220px"
                bgGradient="linear(to-r, teal.50, purple.50)"
                _dark={{ bgGradient: "linear(to-r, teal.900, purple.900)" }}
              />
              <Flex gap={3} wrap="wrap">
                {weeklyTrends.map((trend) => (
                  <Box key={trend.label} p={4} borderWidth="1px" borderRadius="md" bg="surface-muted" flex={1} minW="180px">
                    <Text fontWeight="medium">{trend.label}</Text>
                    <Text color="gray.600" _dark={{ color: "gray.300" }} fontSize="sm">
                      {trend.value}
                    </Text>
                    <Badge colorScheme="teal" mt={2}>
                      {trend.delta}
                    </Badge>
                  </Box>
                ))}
              </Flex>
            </Stack>
          </Box>

          <Box p={{ base: 6, md: 8 }} bg="surface" borderRadius="lg" borderWidth="1px" shadow="sm">
            <Stack spacing={4}>
              <Flex justify="space-between" align="center">
                <Heading size="md">Activity feed</Heading>
                <Button size="sm" variant="ghost" colorScheme="teal">
                  See all
                </Button>
              </Flex>
              <VStack align="stretch" spacing={3}>
                {activityFeed.map((activity) => (
                  <Box key={activity.id} p={4} borderWidth="1px" borderRadius="md" bg="surface-muted">
                    <Flex justify="space-between" align={{ base: "flex-start", md: "center" }} direction={{ base: "column", md: "row" }} gap={2}>
                      <Stack spacing={1}>
                        <Text fontWeight="medium">{activity.name}</Text>
                        <Text color="gray.600" _dark={{ color: "gray.300" }}>
                          {activity.distance} · {activity.time}
                        </Text>
                      </Stack>
                      <Badge colorScheme="teal" variant="subtle">
                        {activity.intensity}
                      </Badge>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            </Stack>
          </Box>
        </SimpleGrid>

        <Box p={{ base: 6, md: 8 }} bg="surface" borderRadius="lg" borderWidth="1px" shadow="sm">
          <Stack spacing={4}>
            <Heading size="md">Highlights</Heading>
            <Divider />
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              {["Load balance", "Recovery", "Stress score"].map((item) => (
                <Box key={item} p={4} borderWidth="1px" borderRadius="md" bg="surface-muted">
                  <Text fontWeight="medium">{item}</Text>
                  <Text color="gray.600" _dark={{ color: "gray.300" }} fontSize="sm">
                    Placeholder values pending API hook-up.
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
