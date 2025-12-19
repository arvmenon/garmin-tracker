"use client";

import { Badge, Box, Container, Heading, HStack, Stack, Text } from "@chakra-ui/react";

import { ActivitiesList } from "@/components/activities/ActivitiesList";

export default function ActivitiesPage() {
  return (
    <Container maxW="6xl" py={{ base: 8, md: 12 }}>
      <Stack spacing={8}>
        <Stack spacing={3}>
          <HStack spacing={3} wrap="wrap">
            <Badge colorScheme="teal" borderRadius="full">
              Activities
            </Badge>
            <Badge colorScheme="purple" variant="subtle" borderRadius="full">
              Pagination ready
            </Badge>
          </HStack>
          <Heading size={{ base: "lg", md: "xl" }}>Browse Garmin syncs</Heading>
          <Text color="text.muted" maxW="3xl">
            Filters, pagination, and loading states follow the dashboard wireframes. Data hydrates from the FastAPI fixtures at
            <code>NEXT_PUBLIC_API_BASE_URL</code>.
          </Text>
          <Text color="text.muted" maxW="3xl">
            Comparison views will live alongside activity timelines, with shared filters and date ranges.
          </Text>
        </Stack>

        <Box borderWidth="1px" borderColor="border.subtle" borderRadius="lg" bg="bg.surface" shadow="card">
          <ActivitiesList />
        </Box>
      </Stack>
    </Container>
  );
}
