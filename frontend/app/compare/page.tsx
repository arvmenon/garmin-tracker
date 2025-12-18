"use client";

import {
  Badge,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Select,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";

const comparisons = [
  { label: "Morning Ride vs Evening Ride", delta: "+6% power", note: "Higher cadence with similar HR." },
  { label: "Tempo Run vs Long Run", delta: "-12 bpm HR", note: "Improved efficiency at same pace." },
];

const filters = [
  { label: "Distance", value: "40-60 km" },
  { label: "Duration", value: "45-90 min" },
  { label: "Sport", value: "Cycling" },
];

export default function ComparePage() {
  return (
    <Container maxW="6xl" py={{ base: 8, md: 12 }}>
      <Stack spacing={8}>
        <Flex direction={{ base: "column", md: "row" }} justify="space-between" gap={4} align={{ base: "flex-start", md: "center" }}>
          <Stack spacing={2}>
            <Badge colorScheme="teal" w="fit-content" px={3} py={1} borderRadius="full">
              Compare activities
            </Badge>
            <Heading size={{ base: "lg", md: "xl" }}>Side-by-side insights.</Heading>
            <Text color="gray.600" _dark={{ color: "gray.300" }}>
              Use the fixtures to validate layout for filters, charts, and summaries before data is live.
            </Text>
          </Stack>
          <HStack spacing={3} wrap="wrap">
            <Button colorScheme="teal">Save comparison</Button>
            <Button variant="outline">Reset filters</Button>
          </HStack>
        </Flex>

        <Box p={{ base: 6, md: 8 }} borderWidth="1px" borderRadius="lg" bg="surface" shadow="sm">
          <Stack spacing={4}>
            <Heading size="md">Filters</Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <Select placeholder="Select primary activity" defaultValue="morning-ride">
                <option value="morning-ride">Morning Ride</option>
                <option value="tempo-run">Tempo Run</option>
              </Select>
              <Select placeholder="Select comparison" defaultValue="evening-ride">
                <option value="evening-ride">Evening Ride</option>
                <option value="long-run">Long Run</option>
              </Select>
              <Select placeholder="Metric focus" defaultValue="power">
                <option value="power">Power</option>
                <option value="hr">Heart rate</option>
                <option value="pace">Pace</option>
              </Select>
            </SimpleGrid>
            <Flex gap={3} wrap="wrap">
              {filters.map((filter) => (
                <Badge key={filter.label} colorScheme="teal" variant="subtle" px={3} py={1} borderRadius="full">
                  {filter.label}: {filter.value}
                </Badge>
              ))}
            </Flex>
            <HStack spacing={4} align={{ base: "flex-start", md: "center" }} justify="space-between" wrap="wrap">
              <Checkbox defaultChecked>Normalize by duration</Checkbox>
              <Checkbox>Align by distance</Checkbox>
              <Checkbox>Show cadence</Checkbox>
            </HStack>
          </Stack>
        </Box>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {["Primary activity", "Comparison"].map((title) => (
            <Box key={title} p={{ base: 6, md: 8 }} borderWidth="1px" borderRadius="lg" bg="surface" shadow="sm">
              <Stack spacing={3}>
                <Flex justify="space-between" align="center">
                  <Heading size="md">{title}</Heading>
                  <Badge colorScheme="purple" variant="subtle">
                    Chart placeholder
                  </Badge>
                </Flex>
                <Box
                  borderWidth="1px"
                  borderStyle="dashed"
                  borderRadius="md"
                  minH="220px"
                  bgGradient="linear(to-r, teal.50, pink.50)"
                  _dark={{ bgGradient: "linear(to-r, teal.900, pink.900)" }}
                />
                <Text color="gray.600" _dark={{ color: "gray.300" }}>
                  Stacked cards collapse on mobile and align in a grid on desktop.
                </Text>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>

        <Box p={{ base: 6, md: 8 }} borderWidth="1px" borderRadius="lg" bg="surface" shadow="sm">
          <Stack spacing={4}>
            <Heading size="md">Findings</Heading>
            <Divider />
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {comparisons.map((item) => (
                <Box key={item.label} p={4} borderWidth="1px" borderRadius="md" bg="surface-muted">
                  <Text fontWeight="medium">{item.label}</Text>
                  <Text color="gray.600" _dark={{ color: "gray.300" }} fontSize="sm">
                    {item.note}
                  </Text>
                  <Badge colorScheme="teal" mt={2}>
                    {item.delta}
                  </Badge>
                </Box>
              ))}
            </SimpleGrid>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
