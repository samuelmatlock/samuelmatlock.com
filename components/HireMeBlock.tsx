import { Box, Text, Link, keyframes } from "@chakra-ui/react";

const orbit = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export function HireMeBlock() {
  return (
    <Box
      position="relative"
      bg="gray.900"
      borderRadius="md"
      px={5}
      py={4}
      mt={1}
      display={{ base: "block", md: "inline-block" }}
      pr={{ base: 5, md: 16 }}
      overflow="visible"
    >
      {/* Orbiting light */}
      <Box
        position="absolute"
        top="-4px"
        left="-4px"
        right="-4px"
        bottom="-4px"
        borderRadius="md"
        pointerEvents="none"
        sx={{
          animation: `${orbit} 5s linear infinite`,
          transformOrigin: "center center",
        }}
      >
        <Box
          position="absolute"
          top="-3px"
          left="calc(50% - 3px)"
          w="6px"
          h="6px"
          borderRadius="full"
          bg="white"
          sx={{
            boxShadow: "0 0 8px 4px rgba(255,255,255,0.8), 0 0 16px 6px rgba(255,255,255,0.3)",
          }}
        />
      </Box>

      <Text color="gray.200" lineHeight={1.75} fontSize={{ base: "xs", md: "sm" }}>
        <Text as="span" color="white" fontWeight="semibold">If you're recruiting,</Text> please check out my{" "}
        <Link
          href="https://linkedin.com/in/samuelmatlock"
          isExternal
          fontWeight="bold"
          sx={{ color: "white !important", textDecoration: "underline !important", textDecorationColor: "rgba(255,255,255,0.7) !important" }}
          _hover={{ sx: { textDecorationColor: "white !important" } }}
        >
          LinkedIn
        </Link>{" "}
        and{" "}
        <Link
          href="https://www.samuelmatlock.com/SamuelMatlockResume.pdf"
          isExternal
          fontWeight="bold"
          sx={{ color: "white !important", textDecoration: "underline !important", textDecorationColor: "rgba(255,255,255,0.7) !important" }}
          _hover={{ sx: { textDecorationColor: "white !important" } }}
        >
          Résumé
        </Link>
        .
      </Text>
    </Box>
  );
}
