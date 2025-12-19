"use client";

import {
  Box,
  Heading,
  Progress,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";

import { SyncStatusCard } from "@/components/sync/SyncStatusCard";

const runtimeStats = [
  { label: "Sync latency", value: "<150ms", detail: "cached fetch + SWR" },
  { label: "UI thread work", value: "1.2ms", detail: "lightweight theming" },
  { label: "Bundle focus", value: "zero CSS-in-JS reset", detail: "Chakra only" },
];

export function RuntimeHealthCard() {
  return (
    <Box
      bg="bg.surface"
      borderRadius="lg"
      shadow="card"
      p={6}
      borderWidth="1px"
      borderColor="border.subtle"
    >
      <Stack spacing={4}>
        <Heading size="md">Runtime health</Heading>
        <Progress value={82} colorScheme="teal" borderRadius="full" aria-label="Runtime readiness" />
        <Stack spacing={3}>
          {runtimeStats.map((stat) => (
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
  );
}
