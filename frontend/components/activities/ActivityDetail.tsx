"use client";

import NextLink from "next/link";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Link,
  SimpleGrid,
  Skeleton,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Text,
} from "@chakra-ui/react";

import { EmptyState } from "@/components/feedback/EmptyState";
import { useActivityDetail } from "@/lib/hooks/useActivityDetail";
import { ActivityDetail as ActivityDetailType } from "@/lib/types";

interface ActivityDetailProps {
  activityId: string;
}

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return [hours, minutes, remainingSeconds]
    .map((value) => value.toString().padStart(2, "0"))
    .join(":");
}

function MetricCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Box p={4} borderWidth="1px" borderRadius="md" bg="bg.surface">
      <Stat>
        <StatLabel color="text.muted">{label}</StatLabel>
        <StatNumber fontSize="2xl">{value}</StatNumber>
        {hint ? <Text color="text.muted">{hint}</Text> : null}
      </Stat>
    </Box>
  );
}

function MetricsGrid({ activity }: { activity: ActivityDetailType }) {
  const entries = activity.metrics || [
    { label: "Duration", value: formatDuration(activity.duration_seconds), hint: "Moving + stopped" },
    { label: "Distance", value: activity.distance_meters ? `${(activity.distance_meters / 1000).toFixed(1)} km` : "–" },
    { label: "Training effect", value: activity.training_effect || "Pending" },
  ];

  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
      {entries.map((metric) => (
        <MetricCard key={metric.label} label={metric.label} value={metric.value} hint={metric.hint} />
      ))}
    </SimpleGrid>
  );
}

function RouteCard({ activity }: { activity: ActivityDetailType }) {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={5} bg="bg.surface">
      <Stack spacing={3}>
        <Heading size="md">Route preview</Heading>
        <Text color="text.muted">
          {activity.route?.summary || "Route line placeholder until map hydration is wired."}
        </Text>
        <Box
          borderWidth="1px"
          borderStyle="dashed"
          borderRadius="md"
          minH="200px"
          bgGradient="linear(to-r, teal.50, blue.50)"
          _dark={{ bgGradient: "linear(to-r, teal.900, blue.900)" }}
        />
        <HStack spacing={2} wrap="wrap">
          <Tag colorScheme="teal">{activity.route?.name || "Loop"}</Tag>
          <Tag variant="outline">{activity.route?.surface || "Mixed"}</Tag>
        </HStack>
      </Stack>
    </Box>
  );
}

function ActivityHeading({ activity }: { activity: ActivityDetailType }) {
  const startTime = new Date(activity.start_time).toLocaleString();
  return (
    <Stack spacing={3}>
      <HStack spacing={3} wrap="wrap">
        <Badge colorScheme="teal" borderRadius="full">
          {activity.type}
        </Badge>
        <Badge colorScheme="purple" variant="subtle">
          {activity.provider}
        </Badge>
        <Badge colorScheme="gray" variant="outline">
          {startTime}
        </Badge>
      </HStack>
      <Heading size={{ base: "lg", md: "xl" }}>{activity.title || "Activity detail"}</Heading>
      <Text color="text.muted">{activity.description || "Summary, metrics, and route notes."}</Text>
    </Stack>
  );
}

export function ActivityDetail({ activityId }: ActivityDetailProps) {
  const { data, isLoading, isError, error } = useActivityDetail(activityId);

  if (isLoading) {
    return (
      <Container maxW="6xl" py={{ base: 8, md: 12 }}>
        <Stack spacing={6}>
          <Skeleton height="24px" width="240px" />
          <Skeleton height="28px" width="320px" />
          <Skeleton height="200px" borderRadius="lg" />
        </Stack>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxW="5xl" py={{ base: 8, md: 12 }}>
        <EmptyState
          title="We hit a snag"
          description={error instanceof Error ? error.message : "Activity details are unavailable."}
          actionLabel="Back to activities"
          onAction={() => window.history.back()}
        />
      </Container>
    );
  }

  if (!data) {
    return (
      <Container maxW="5xl" py={{ base: 8, md: 12 }}>
        <EmptyState
          title="No detail found"
          description="The activity id did not return data. Check the URL or reload from the list view."
          actionLabel="Return to list"
          onAction={() => window.history.back()}
        />
      </Container>
    );
  }

  return (
    <Container maxW="6xl" py={{ base: 8, md: 12 }}>
      <Stack spacing={8}>
        <Flex direction={{ base: "column", md: "row" }} justify="space-between" gap={4} align={{ base: "flex-start", md: "center" }}>
          <ActivityHeading activity={data} />
          <Stack direction={{ base: "column", sm: "row" }} spacing={3} align={{ base: "stretch", sm: "center" }}>
            <Badge colorScheme="teal">{formatDuration(data.duration_seconds)}</Badge>
            <Badge colorScheme="blue">
              {data.distance_meters ? `${(data.distance_meters / 1000).toFixed(1)} km` : "Distance TBD"}
            </Badge>
            <Badge colorScheme="gray" variant="outline">
              {data.elevation_gain_meters ? `${data.elevation_gain_meters} m gain` : "Elevation pending"}
            </Badge>
          </Stack>
        </Flex>

        <MetricsGrid activity={data} />

        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6} alignItems="start">
          <GridItem>
            <Tabs variant="enclosed" colorScheme="teal">
              <TabList>
                <Tab>Summary</Tab>
                <Tab>Metrics</Tab>
                <Tab>Route</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Stack spacing={4}>
                    <Text color="text.muted">
                      Notes and telemetry will hydrate from the API once endpoints are connected. Until then, this layout keeps
                      the wireframe semantics intact.
                    </Text>
                  </Stack>
                </TabPanel>
                <TabPanel>
                  <MetricsGrid activity={data} />
                </TabPanel>
                <TabPanel>
                  <RouteCard activity={data} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </GridItem>

          <GridItem>
            <Stack spacing={4}>
              <Box p={5} borderWidth="1px" borderRadius="lg" bg="bg.surface" shadow="sm">
                <Heading size="md" mb={2}>
                  Activity context
                </Heading>
                <Text color="text.muted">
                  Use this card to summarize training plan alignment, fueling, or route notes.
                </Text>
              </Box>
              <Box p={5} borderWidth="1px" borderRadius="lg" bg="bg.surface" shadow="sm">
                <Heading size="md" mb={2}>
                  Device & sensors
                </Heading>
                <Stack spacing={2}>
                  {["Edge 840", "HRM-Pro Plus", "Garmin Rally"].map((device) => (
                    <Text key={device}>{device}</Text>
                  ))}
                </Stack>
              </Box>
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Need a different activity?</AlertTitle>
                  <AlertDescription>
                    <Link as={NextLink} href="/activities" color="teal.500" fontWeight="semibold">
                      Return to the activity list
                    </Link>
                    {" "}
                    to select another session.
                  </AlertDescription>
                </Box>
              </Alert>
            </Stack>
          </GridItem>
        </Grid>
      </Stack>
    </Container>
  );
}
