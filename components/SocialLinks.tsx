import { HStack, Link, Icon, Box, Input } from "@chakra-ui/react";
import { FaLinkedinIn, FaTwitter, FaGithub, FaEnvelope } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

function EmailCopy() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setCopied(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleCopy = () => {
    navigator.clipboard.writeText("samuel.matlock1@gmail.com");
    setCopied(true);
  };

  return (
    <Box position="relative" display="inline-flex" alignItems="center" ref={containerRef}>
      <Box
        as="button"
        onClick={() => { setOpen((v) => !v); setCopied(false); }}
        aria-label="Show email"
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
      {open && (
        <Box
          position="absolute"
          bottom="calc(100% + 8px)"
          left="50%"
          transform="translateX(-50%)"
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          boxShadow="md"
          p={3}
          pt={4}
          whiteSpace="nowrap"
          zIndex={100}
          minW="240px"
        >
          {/* Close button */}
          <Box
            as="button"
            position="absolute"
            top={1}
            right={1}
            onClick={() => { setOpen(false); setCopied(false); }}
            color="gray.400"
            _hover={{ color: "gray.700" }}
            display="flex"
            alignItems="center"
            p={1}
          >
            <Icon as={FiX} boxSize={3} />
          </Box>

          {/* Email input */}
          <Input
            value="samuel.matlock1@gmail.com"
            isReadOnly
            size="sm"
            fontSize="xs"
            borderColor="gray.200"
            mb={2}
            onFocus={(e) => e.target.select()}
          />

          {/* Copy button */}
          <Box
            as="button"
            onClick={handleCopy}
            fontSize="xs"
            color={copied ? "green.500" : "gray.500"}
            _hover={{ color: copied ? "green.500" : "gray.800" }}
            transition="color 0.15s"
          >
            {copied ? "Copied!" : "Copy"}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export function SocialLinks() {
  return (
    <HStack spacing={4} mt={1} alignItems="center">
      <Link href="https://linkedin.com/in/samuelmatlock" isExternal aria-label="LinkedIn" display="flex" alignItems="center">
        <Icon as={FaLinkedinIn} boxSize={5} color="gray.400" _hover={{ color: "gray.700" }} transition="color 0.15s" />
      </Link>
      <Link href="https://twitter.com/samuelmatlock" isExternal aria-label="Twitter" display="flex" alignItems="center">
        <Icon as={FaTwitter} boxSize={5} color="gray.400" _hover={{ color: "gray.700" }} transition="color 0.15s" />
      </Link>
      <Link href="https://github.com/samuelmatlock" isExternal aria-label="GitHub" display="flex" alignItems="center">
        <Icon as={FaGithub} boxSize={5} color="gray.400" _hover={{ color: "gray.700" }} transition="color 0.15s" />
      </Link>
      <EmailCopy />
    </HStack>
  );
}
