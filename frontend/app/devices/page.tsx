"use client";

import {
  Badge,
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";

const devices = [
  {
    name: "Garmin Forerunner 965",
    status: "Synced 12 min ago",
    detail: "Primary running watch · HR + GPS",
  },
  {
    name: "Garmin Edge 1040",
    status: "Synced 2 hrs ago",
    detail: "Cycling computer · Power meter paired",
  },
  {
    name: "Garmin Varia RTL515",
    status: "Needs attention",
    detail: "Radar alerts · Firmware update available",
  },
  {
    name: "Garmin Index S2",
    status: "Synced yesterday",
    detail: "Body composition · Wi-Fi connected",
  },
];

export default function DevicesPage() {
  return (
    <Container maxW="6xl" py={{ base: 8, md: 12 }}>
      <Stack spacing={8}>
        <Flex direction={{ base: "column", md: "row" }} justify="space-between" gap={4} align={{ base: "flex-start", md: "center" }}>
          <Stack spacing={2}>
            <HStack spacing={3} wrap="wrap">
              <Badge colorScheme="teal" w="fit-content" px={3} py={1} borderRadius="full">
                Devices
              </Badge>
              <Badge colorScheme="blue" variant="subtle" borderRadius="full">
                Garmin connected
              </Badge>
            </HStack>
            <Heading size={{ base: "lg", md: "xl" }}>Track your hardware fleet.</Heading>
            <Text color="text.muted" maxW="3xl">
              Confirm device sync cadence, firmware health, and sensor pairings across watches, bike computers, and wearables.
            </Text>
          </Stack>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {devices.map((device) => (
            <Box key={device.name} p={{ base: 6, md: 8 }} borderWidth="1px" borderRadius="lg" bg="surface" shadow="sm">
              <Stack spacing={3}>
                <Heading size="md">{device.name}</Heading>
                <Text color="text.muted">{device.detail}</Text>
                <Badge colorScheme={device.status === "Needs attention" ? "red" : "green"} w="fit-content">
                  {device.status}
                </Badge>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
