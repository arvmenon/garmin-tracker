import { Box, Container } from "@chakra-ui/react";

import { AppSkeleton } from "@/components/feedback/AppSkeleton";

export default function Loading() {
  return (
    <Box as="main" aria-label="Loading content">
      <Container maxW="6xl" py={{ base: 8, md: 12 }}>
        <AppSkeleton />
      </Container>
    </Box>
  );
}
