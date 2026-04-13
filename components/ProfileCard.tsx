import { Box, Heading, Text, Link } from "@chakra-ui/react";
import { SocialLinks } from "./SocialLinks";

export function ProfileCard() {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.100"
      borderRadius="xl"
      px={5}
      py={5}
      display="inline-block"
      overflow="visible"
      mb={6}
    >
      <Heading
        as="h1"
        size="lg"
        fontFamily="inherit"
        color="gray.900"
        mb={2}
        mt={0}
      >
        Samuel Matlock
      </Heading>

      <SocialLinks />

      <Box mt={4}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "0.25rem", marginTop: 0, color: "#1A202C", fontFamily: "inherit" }}>
          Implementation{" "}
          <a
            href="https://hazeltree.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "#3182CE" }}
          >
            @ Hazeltree
          </a>
        </h3>
        <p style={{ margin: 0, color: "#1A202C", fontSize: "0.95rem" }}>Senior Associate</p>
      </Box>

      <p style={{ fontSize: "0.85rem", marginTop: "0.5rem", marginBottom: 0, color: "#4A5568" }}>
        Implementation, Solution Engineering, and Pre-Sales Consulting.
      </p>
    </Box>
  );
}
