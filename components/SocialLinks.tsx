import { HStack, Link, Icon, Box } from "@chakra-ui/react";
import { FaLinkedinIn, FaTwitter, FaGithub, FaEnvelope } from "react-icons/fa";
import { useState } from "react";

function EmailCopy() {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    navigator.clipboard.writeText("samuel.matlock1@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box position="relative" display="inline-flex" alignItems="center">
      <Box
        as="button"
        onClick={handleClick}
        aria-label="Copy email"
        display="flex"
        alignItems="center"
      >
        <Icon
          as={FaEnvelope}
          boxSize={5}
          color="gray.400"
          _hover={{ color: "gray.700" }}
          transition="color 0.15s"
        />
      </Box>
      {copied && (
        <Box
          position="absolute"
          bottom="calc(100% + 6px)"
          left="50%"
          transform="translateX(-50%)"
          bg="gray.900"
          color="white"
          fontSize="xs"
          px={2}
          py={1}
          borderRadius="md"
          whiteSpace="nowrap"
          pointerEvents="none"
        >
          Copied!
        </Box>
      )}
    </Box>
  );
}

export function SocialLinks() {
  return (
    <HStack spacing={4} mt={1}>
      <Link href="https://linkedin.com/in/samuelmatlock" isExternal aria-label="LinkedIn">
        <Icon as={FaLinkedinIn} boxSize={5} color="gray.400" _hover={{ color: "gray.700" }} transition="color 0.15s" />
      </Link>
      <Link href="https://twitter.com/samuelmatlock" isExternal aria-label="Twitter">
        <Icon as={FaTwitter} boxSize={5} color="gray.400" _hover={{ color: "gray.700" }} transition="color 0.15s" />
      </Link>
      <Link href="https://github.com/samuelmatlock" isExternal aria-label="GitHub">
        <Icon as={FaGithub} boxSize={5} color="gray.400" _hover={{ color: "gray.700" }} transition="color 0.15s" />
      </Link>
      <EmailCopy />
    </HStack>
  );
}
