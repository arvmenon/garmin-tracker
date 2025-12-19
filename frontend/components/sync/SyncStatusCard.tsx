"use client";

import {
  Badge,
  Box,
  Flex,
  HStack,
  Icon,
  Spinner,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { MdCheckCircle, MdErrorOutline, MdSync } from "react-icons/md";

import { useSyncStatus } from "@/lib/hooks/useSyncStatus";

export function SyncStatusCard() {
  const { data, isLoading, isError } = useSyncStatus();
  const border = useColorModeValue("border.subtle", "border.emphasis");

  const statusColor = data?.status === "ok" ? "green" : isError ? "red" : "gray";
  const StatusIcon = data?.status === "ok" ? MdCheckCircle : isError ? MdErrorOutline : MdSync;

  return (
    <Box
      p={4}
      borderRadius="md"
      borderWidth="1px"
      borderColor={border}
      bg="bg.surface"
      minW={{ base: "full", md: "320px" }}
      role="status"
      aria-live="polite"
    >
      <HStack justify="space-between" align="center" spacing={3}>
        <HStack spacing={3}>
          {isLoading ? <Spinner size="sm" color="teal.500" /> : <Icon as={StatusIcon} color={`${statusColor}.500`} boxSize={5} />}
          <Stack spacing={0}>
            <Text fontWeight="semibold">Sync status</Text>
            <Text color="text.muted" fontSize="sm">
              {isError
                ? "API unreachable"
                : data?.status === "ok"
                  ? "Garmin fixtures healthy"
                  : "Waiting for first heartbeat"}
            </Text>
          </Stack>
        </HStack>
        <Badge colorScheme={statusColor} variant="subtle" borderRadius="full">
          {isError ? "Error" : isLoading ? "Loading" : data?.environment || "unknown"}
        </Badge>
      </HStack>

      <Flex mt={3} align="center" justify="space-between">
        <Text color="text.muted" fontSize="sm">
          {data?.timestamp ? new Date(data.timestamp).toLocaleTimeString() : "No timestamp"}
        </Text>
        <Tooltip label="Refreshes every 30 seconds" placement="top">
          <Badge variant="outline" colorScheme="teal">
            Background refresh
          </Badge>
        </Tooltip>
      </Flex>
    </Box>
  );
}
