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
  };

  return (
    <VStack align="flex-start" spacing={0} ref={containerRef} style={{ marginBottom: open ? "-16px" : "0" }}>
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

      {open && (
        <Box
          style={{ marginTop: "14px" }}
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          boxShadow="sm"
          p={3}
          w="220px"
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box fontSize="xs" color="gray.400">samuel.matlock1@gmail.com</Box>
            <Box
              as="button"
              onClick={() => { setOpen(false); setCopied(false); }}
              color="gray.300"
              _hover={{ color: "gray.600" }}
              display="flex"
              alignItems="center"
              transition="color 0.15s"
            >
              <Icon as={FiX} boxSize={3} />
            </Box>
          </Box>

          <Input
            value="samuel.matlock1@gmail.com"
            isReadOnly
            size="sm"
            fontSize="xs"
            borderColor="gray.200"
            bg="gray.50"
            mb={2}
            onFocus={(e) => e.target.select()}
          />

          <Box textAlign="center">
            <Box
              as="button"
              onClick={handleCopy}
              fontSize="xs"
              fontWeight="semibold"
              color={copied ? "green.500" : "gray.500"}
              _hover={{ color: copied ? "green.500" : "gray.800" }}
              transition="color 0.15s"
            >
              {copied ? "Copied!" : "Copy to clipboard"}
            </Box>
          </Box>
        </Box>
      )}
    </VStack>
  );
}
