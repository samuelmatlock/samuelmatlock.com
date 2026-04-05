import { HStack, Link, Icon } from "@chakra-ui/react";
import { FaLinkedinIn, FaTwitter, FaGithub } from "react-icons/fa";

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
    </HStack>
  );
}
