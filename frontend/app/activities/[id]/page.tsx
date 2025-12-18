"use client";

import {
  Badge,
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";

const activity = {
  title: "Mock Ride - River Loop",
  distance: "42.4 km",
  time: "1:36:22",
  elevation: "540 m",
  intensity: "Tempo",
  power: "238 W avg",
  heartRate: "146 bpm avg",
  trainingEffect: "3.6 aerobic",
};

const splits = [
  { label: "0-10 km", pace: "24.3 km/h", heartRate: "142 bpm" },
  { label: "10-20 km", pace: "26.1 km/h", heartRate: "148 bpm" },
  { label: "20-30 km", pace: "25.4 km/h", heartRate: "147 bpm" },
  { label: "30-42 km", pace: "24.8 km/h", heartRate: "150 bpm" },
];

export default function ActivityDetailPage() {
  return (
    <Container maxW="6xl" py={{ base: 8, md: 12 }}>
      <Stack spacing={8}>
        <Flex direction={{ base: "column", md: "row" }} justify="space-between" gap={4} align={{ base: "flex-start", md: "center" }}>
          <Stack spacing={2}>
            <Badge colorScheme="teal" w="fit-content" px={3} py={1} borderRadius="full">
              Activity detail
            </Badge>
            <Heading size={{ base: "lg", md: "xl" }}>{activity.title}</Heading>
            <HStack spacing={3} wrap="wrap">
              <Badge colorScheme="purple" variant="subtle">
                {activity.intensity}
              </Badge>
              <Text color="gray.600" _dark={{ color: "gray.300" }}>
                Static fixtures show the layout until this route is wired to the API.
              </Text>
            </HStack>
          </Stack>
          <Stack direction={{ base: "column", sm: "row" }} spacing={3} align={{ base: "stretch", sm: "center" }}>
            <Badge colorScheme="teal">{activity.time}</Badge>
            <Badge colorScheme="blue">{activity.distance}</Badge>
          </Stack>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
          {[
            { label: "Distance", value: activity.distance },
            { label: "Elapsed time", value: activity.time },
            { label: "Elevation gain", value: activity.elevation },
            { label: "Power", value: activity.power },
          ].map((metric) => (
            <Box key={metric.label} p={4} borderWidth="1px" borderRadius="md" bg="surface" shadow="sm">
              <Text color="gray.500" _dark={{ color: "gray.400" }} fontSize="sm">
                {metric.label}
              </Text>
              <Heading size="md">{metric.value}</Heading>
            </Box>
          ))}
        </SimpleGrid>

        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6} alignItems="start">
          <GridItem>
            <Tabs variant="enclosed" colorScheme="teal">
              <TabList>
                <Tab>Summary</Tab>
                <Tab>Splits</Tab>
                <Tab>Notes</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Stack spacing={4}>
                    <Box borderWidth="1px" borderRadius="md" p={4} bg="surface-muted">
                      <Heading size="sm" mb={2}>
                        Power & HR placeholder
                      </Heading>
                      <Box
                        borderWidth="1px"
                        borderStyle="dashed"
                        borderRadius="md"
                        minH="200px"
                        bgGradient="linear(to-r, teal.50, blue.50)"
                        _dark={{ bgGradient: "linear(to-r, teal.900, blue.900)" }}
                      />
                    </Box>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
                      {[activity.trainingEffect, activity.heartRate, activity.power].map((item) => (
                        <Box key={item} p={4} borderWidth="1px" borderRadius="md" bg="surface">
                          <Text fontWeight="medium">{item}</Text>
                          <Text color="gray.600" _dark={{ color: "gray.300" }} fontSize="sm">
                            Fixture only — values to be hydrated.
                          </Text>
                        </Box>
                      ))}
                    </SimpleGrid>
                  </Stack>
                </TabPanel>
                <TabPanel>
                  <Stack spacing={3}>
                    {splits.map((split) => (
                      <Flex
                        key={split.label}
                        justify="space-between"
                        align={{ base: "flex-start", md: "center" }}
                        direction={{ base: "column", md: "row" }}
                        p={4}
                        borderWidth="1px"
                        borderRadius="md"
                        bg="surface"
                        gap={2}
                      >
                        <Text fontWeight="medium">{split.label}</Text>
                        <HStack spacing={3}>
                          <Badge colorScheme="teal" variant="subtle">
                            {split.pace}
                          </Badge>
                          <Badge colorScheme="blue" variant="subtle">
                            {split.heartRate}
                          </Badge>
                        </HStack>
                      </Flex>
                    ))}
                  </Stack>
                </TabPanel>
                <TabPanel>
                  <Stack spacing={3}>
                    {["Felt strong after warmup", "Targeted mid-ride surges"].map((note) => (
                      <Box key={note} p={4} borderWidth="1px" borderRadius="md" bg="surface">
                        <Text>{note}</Text>
                      </Box>
                    ))}
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </GridItem>

          <GridItem>
            <Stack spacing={4}>
              <Box p={5} borderWidth="1px" borderRadius="lg" bg="surface" shadow="sm">
                <Heading size="md" mb={2}>
                  Activity context
                </Heading>
                <Text color="gray.600" _dark={{ color: "gray.300" }}>
                  Use this card to summarize training plan alignment, fueling, or route notes.
                </Text>
              </Box>
              <Box p={5} borderWidth="1px" borderRadius="lg" bg="surface" shadow="sm">
                <Heading size="md" mb={2}>
                  Device & sensors
                </Heading>
                <Stack spacing={2}>
                  {["Edge 840", "HRM-Pro Plus", "Garmin Rally"]
                    .map((device) => (
                      <Text key={device}>{device}</Text>
                    ))}
                </Stack>
              </Box>
            </Stack>
          </GridItem>
        </Grid>
      </Stack>
    </Container>
  );
}
