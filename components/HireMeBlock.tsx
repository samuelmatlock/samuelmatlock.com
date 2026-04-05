import { Box, Text, Link } from "@chakra-ui/react";

export function HireMeBlock() {
  return (
    <Box bg="gray.900" borderRadius="md" px={5} py={4} mt={1} display={{ base: "block", md: "inline-block" }} pr={{ base: 5, md: 16 }}>
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
