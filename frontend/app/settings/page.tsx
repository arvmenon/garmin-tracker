"use client";

import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";

const navItems = ["Profile", "Data sources", "Notifications", "Privacy", "Billing"];

const toggles = [
  { label: "Weekly digest", description: "Email summary of training load and recovery." },
  { label: "Push alerts", description: "Real-time notifications when sync fails." },
  { label: "Share anonymized stats", description: "Opt in to comparisons without exposing identity." },
];

export default function SettingsPage() {
  return (
    <Container maxW="6xl" py={{ base: 8, md: 12 }}>
      <Stack spacing={8}>
        <Flex direction={{ base: "column", md: "row" }} justify="space-between" gap={4} align={{ base: "flex-start", md: "center" }}>
          <Stack spacing={2}>
            <Badge colorScheme="teal" w="fit-content" px={3} py={1} borderRadius="full">
              Settings
            </Badge>
            <Heading size={{ base: "lg", md: "xl" }}>Configure your workspace.</Heading>
            <Text color="gray.600" _dark={{ color: "gray.300" }}>
              Static fixtures model the layout for navigation and content cards across breakpoints.
            </Text>
          </Stack>
          <Button colorScheme="teal">Save changes</Button>
        </Flex>

        <Flex direction={{ base: "column", md: "row" }} gap={6} align="flex-start">
          <Box
            flexBasis={{ base: "100%", md: "240px" }}
            p={5}
            borderWidth="1px"
            borderRadius="lg"
            bg="surface"
            shadow="sm"
          >
            <VStack align="stretch" spacing={2}>
              {navItems.map((item, index) => (
                <Button
                  key={item}
                  variant={index === 1 ? "solid" : "ghost"}
                  colorScheme="teal"
                  justifyContent="flex-start"
                >
                  {item}
                </Button>
              ))}
            </VStack>
          </Box>

          <Stack flex={1} spacing={6} w="100%">
            <Box p={{ base: 6, md: 8 }} borderWidth="1px" borderRadius="lg" bg="surface" shadow="sm">
              <Stack spacing={3}>
                <Heading size="md">Data sources</Heading>
                <Text color="gray.600" _dark={{ color: "gray.300" }}>
                  Confirm Garmin connections and third-party imports.
                </Text>
                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                  {["Garmin Connect", "TrainingPeaks", "Strava", "Apple Health"].map((source) => (
                    <Box key={source} p={4} borderWidth="1px" borderRadius="md" bg="surface-muted">
                      <Flex justify="space-between" align="center">
                        <Text fontWeight="medium">{source}</Text>
                        <Badge colorScheme="teal" variant="subtle">
                          Connected
                        </Badge>
                      </Flex>
                    </Box>
                  ))}
                </SimpleGrid>
              </Stack>
            </Box>

            <Box p={{ base: 6, md: 8 }} borderWidth="1px" borderRadius="lg" bg="surface" shadow="sm">
              <Stack spacing={4}>
                <Heading size="md">Notifications</Heading>
                <Divider />
                <VStack align="stretch" spacing={3}>
                  {toggles.map((toggle) => (
                    <Flex key={toggle.label} justify="space-between" align={{ base: "flex-start", md: "center" }} gap={3} wrap="wrap">
                      <Stack spacing={1}>
                        <Text fontWeight="medium">{toggle.label}</Text>
                        <Text color="gray.600" _dark={{ color: "gray.300" }} fontSize="sm">
                          {toggle.description}
                        </Text>
                      </Stack>
                      <Switch colorScheme="teal" defaultChecked />
                    </Flex>
                  ))}
                </VStack>
              </Stack>
            </Box>
          </Stack>
        </Flex>
      </Stack>
    </Container>
  );
}
