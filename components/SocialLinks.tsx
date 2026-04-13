import { VStack, HStack, Link, Icon, Box, Input } from "@chakra-ui/react";
import { FaLinkedinIn, FaTwitter, FaGithub, FaEnvelope } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

export function SocialLinks() {
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
    setTimeout(() => { setOpen(false); setCopied(false); }, 5000);
  };

  return (
    <VStack align="flex-start" spacing={0} ref={containerRef} style={{ marginBottom: open ? "0px" : "0" }}>
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
            color={open ? "gray.700" : "gray.400"}
            _hover={{ color: "gray.700" }}
            transition="color 0.15s"
          />
        </Box>
      </HStack>

      <Box
          style={{
            marginTop: open ? "14px" : "0px",
            maxHeight: open ? "120px" : "0px",
            opacity: open ? 1 : 0,
            overflow: "hidden",
            transition: "max-height 0.3s ease, opacity 0.25s ease, margin-top 0.3s ease",
          }}
        >
        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          boxShadow="sm"
          px={5}
          pr={8}
          py={4}
          position="relative"
          display="inline-block"
        >
          {/* X close in top right */}
          <Box
            as="button"
            position="absolute"
            top={2}
            right={2}
            onClick={() => { setOpen(false); setCopied(false); }}
            color="gray.500"
            _hover={{ color: "gray.800" }}
            display="flex"
            alignItems="center"
            transition="color 0.15s"
          >
            <Icon as={FiX} boxSize={3} />
          </Box>

          {/* Input + Copy side by side */}
          <HStack spacing={2} alignItems="center">
            <Input
              value="samuel.matlock1@gmail.com"
              isReadOnly
              size="sm"
              fontSize="xs"
              borderColor="gray.200"
              bg="gray.50"
              w="200px"
              onFocus={(e) => e.target.select()}
            />
            <Box
              as="button"
              onClick={handleCopy}
              fontSize="xs"
              fontWeight="semibold"
              px={3}
              py={1}
              w="80px"
              borderRadius="md"
              border="1px solid"
              borderColor={copied ? "green.400" : "gray.300"}
              color={copied ? "green.500" : "gray.600"}
              bg={copied ? "green.50" : "gray.50"}
              _hover={{ bg: copied ? "green.50" : "gray.100", borderColor: copied ? "green.400" : "gray.400" }}
              transition="all 0.15s"
              whiteSpace="nowrap"
              textAlign="center"
            >
              {copied ? "Copied!" : "Copy"}
            </Box>
          </HStack>
        </Box>
        </Box>
    </VStack>
  );
}
