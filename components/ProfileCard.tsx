import { Box, Flex, Heading, Image } from "@chakra-ui/react";
import { SocialLinks } from "./SocialLinks";

export function ProfileCard() {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      px={5}
      py={5}
      width="100%"
      overflow="visible"
      mb={2}
    >
      <Flex justify="space-between" align="center">
        <Box>
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
        </Box>

        <Image
          src="/siteHeadshot.png"
          boxSize={{ base: "72px", md: "88px" }}
          borderRadius="full"
          border="2px solid white"
          boxShadow="0 0 0 1px rgba(0,0,0,0.08)"
          objectFit="cover"
          flexShrink={0}
          ml={{ base: 3, md: 6 }}
        />
      </Flex>

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
