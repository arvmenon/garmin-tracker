import { Button, Heading, Stack, Text, VStack } from "@chakra-ui/react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <VStack
      spacing={4}
      p={{ base: 6, md: 10 }}
      borderWidth="1px"
      borderColor="border.subtle"
      borderRadius="lg"
      bg="bg.surface"
      align="center"
      textAlign="center"
    >
      <Stack spacing={2}>
        <Heading size="md">{title}</Heading>
        <Text color="text.muted" maxW="520px">
          {description}
        </Text>
      </Stack>
      {actionLabel ? (
        <Button onClick={onAction} variant="solid" borderRadius="full">
          {actionLabel}
        </Button>
      ) : null}
    </VStack>
  );
}
