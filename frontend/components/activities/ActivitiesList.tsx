"use client";

import { useMemo, useState } from "react";
import NextLink from "next/link";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  Input,
  Select,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { MdRefresh, MdTrendingUp } from "react-icons/md";

import { EmptyState } from "@/components/feedback/EmptyState";
import { useActivities } from "@/lib/hooks/useActivities";
import { ActivitySummary } from "@/lib/types";

interface ActivitiesListProps {
  pageSize?: number;
}

function formatDistance(distanceMeters?: number) {
  if (!distanceMeters) return "–";
  const kilometers = distanceMeters / 1000;
  return `${kilometers.toFixed(1)} km`;
}

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return [hours, minutes, remainingSeconds]
    .map((value) => value.toString().padStart(2, "0"))
    .join(":");
}

function ActivityCard({ activity }: { activity: ActivitySummary }) {
  const startTime = new Date(activity.start_time).toLocaleString();
  return (
    <Grid
      as={NextLink}
      href={`/activities/${activity.id}`}
      templateColumns={{ base: "1fr", md: "1fr 1fr" }}
      gap={4}
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      bg="bg.surface"
      _hover={{ shadow: "md", textDecoration: "none", borderColor: "teal.400" }}
      _focusVisible={{ boxShadow: "outline" }}
    >
      <GridItem>
        <Stack spacing={2}>
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
          <Text fontWeight="semibold" fontSize="lg">
            Session {activity.id.slice(0, 6)}
          </Text>
          <Text color="text.muted">Duration tuned for the wireframes and ready for API hydration.</Text>
        </Stack>
      </GridItem>

      <GridItem>
        <HStack spacing={4} justify={{ base: "flex-start", md: "flex-end" }} align="center">
          <VStack spacing={1} align="flex-start">
            <Text fontSize="sm" color="text.muted">
              Distance
            </Text>
            <Text fontWeight="semibold">{formatDistance(activity.distance_meters)}</Text>
          </VStack>
          <VStack spacing={1} align="flex-start">
            <Text fontSize="sm" color="text.muted">
              Time
            </Text>
            <Text fontWeight="semibold">{formatDuration(activity.duration_seconds)}</Text>
          </VStack>
          <VStack spacing={1} align="flex-start">
            <Text fontSize="sm" color="text.muted">
              HR / Power
            </Text>
            <Text fontWeight="semibold">
              {activity.average_heart_rate ? `${activity.average_heart_rate} bpm` : "–"} ·
              {activity.average_power ? ` ${activity.average_power} W` : " –"}
            </Text>
          </VStack>
        </HStack>
      </GridItem>
    </Grid>
  );
}

export function ActivitiesList({ pageSize = 6 }: ActivitiesListProps) {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [providerFilter, setProviderFilter] = useState<string>("");
  const [search, setSearch] = useState("");

  const queryParams = useMemo(
    () => ({
      page,
      pageSize,
      type: typeFilter || undefined,
      provider: providerFilter || undefined,
      search: search || undefined,
    }),
    [page, pageSize, providerFilter, search, typeFilter],
  );

  const { data, isLoading, isError, error, isFetching, refetch } = useActivities(queryParams);

  const showEmpty = !isLoading && data && data.items.length === 0;

  return (
    <Container maxW="6xl" py={{ base: 6, md: 10 }}>
      <Stack spacing={6}>
        <Flex direction={{ base: "column", md: "row" }} justify="space-between" gap={4} align={{ base: "flex-start", md: "center" }}>
          <Stack spacing={2}>
            <HStack spacing={2}>
              <Icon as={MdTrendingUp} aria-hidden color="teal.500" />
              <Text fontWeight="semibold">Recent activities</Text>
            </HStack>
            <Text color="text.muted">Filters and pagination align with the dashboard wireframes.</Text>
          </Stack>
          <HStack spacing={3} w={{ base: "full", md: "auto" }}>
            <Select
              placeholder="Type"
              value={typeFilter}
              onChange={(event) => {
                setPage(1);
                setTypeFilter(event.target.value);
              }}
            >
              <option value="running">Running</option>
              <option value="cycling">Cycling</option>
            </Select>
            <Select
              placeholder="Provider"
              value={providerFilter}
              onChange={(event) => {
                setPage(1);
                setProviderFilter(event.target.value);
              }}
            >
              <option value="garmin">Garmin</option>
            </Select>
          </HStack>
        </Flex>

        <Flex gap={3} direction={{ base: "column", md: "row" }}>
          <Input
            placeholder="Search by id, provider, or type"
            value={search}
            onChange={(event) => {
              setPage(1);
              setSearch(event.target.value);
            }}
          />
          <Button variant="outline" leftIcon={<Icon as={MdRefresh} />} onClick={() => refetch()} isLoading={isFetching}>
            Refresh
          </Button>
        </Flex>

        {isError ? (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle>Unable to load activities</AlertTitle>
              <AlertDescription>{error instanceof Error ? error.message : "Try again in a moment."}</AlertDescription>
            </Box>
          </Alert>
        ) : null}

        {isLoading ? (
          <Stack spacing={4}>
            {[...Array(pageSize)].map((_, index) => (
              <Box key={index} borderWidth="1px" borderRadius="lg" p={4} bg="bg.surface">
                <Skeleton height="24px" width="220px" mb={3} />
                <SkeletonText noOfLines={2} spacing={2} />
              </Box>
            ))}
          </Stack>
        ) : showEmpty ? (
          <EmptyState
            title="No activities yet"
            description="Connect Garmin or adjust filters to see synced sessions."
            actionLabel="Reset filters"
            onAction={() => {
              setTypeFilter("");
              setProviderFilter("");
              setSearch("");
              setPage(1);
            }}
          />
        ) : (
          <Stack spacing={4}>
            {data?.items.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </Stack>
        )}

        <Flex justify="space-between" align="center">
          <Text color="text.muted" fontSize="sm">
            Page {page} · {data?.count ?? 0} activities
          </Text>
          <HStack spacing={3}>
            <Button
              variant="ghost"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              isDisabled={page === 1 || isLoading}
            >
              Previous
            </Button>
            <Button
              colorScheme="teal"
              onClick={() => setPage((current) => current + 1)}
              isDisabled={!data?.hasMore || isLoading}
            >
              Next
            </Button>
          </HStack>
        </Flex>
      </Stack>
    </Container>
  );
}
