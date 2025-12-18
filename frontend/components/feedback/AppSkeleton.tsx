import { Box, Skeleton, SkeletonText, Stack } from "@chakra-ui/react";

export function AppSkeleton() {
  return (
    <Stack spacing={6} role="status" aria-live="polite">
      <Stack spacing={3}>
        <Skeleton height="24px" width="180px" borderRadius="md" />
        <SkeletonText noOfLines={2} spacing={3} skeletonHeight="16px" />
      </Stack>
      <Stack direction={{ base: "column", md: "row" }} spacing={4}>
        {[...Array(3)].map((_, index) => (
          <Box key={index} flex={1}>
            <Skeleton height={{ base: "140px", md: "180px" }} borderRadius="lg" />
          </Box>
        ))}
      </Stack>
      <Stack spacing={3}>
        <SkeletonText noOfLines={3} spacing={3} skeletonHeight="14px" />
      </Stack>
    </Stack>
  );
}
