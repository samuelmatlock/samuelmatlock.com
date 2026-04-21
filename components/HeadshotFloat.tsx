import { Box, Image } from "@chakra-ui/react";

export function HeadshotFloat() {
  return (
    <Box float="right" ml={4} mt={1}>
      <Image
        src="/siteHeadshot.png"
        boxSize="72px"
        borderRadius="full"
        border="2px solid white"
        boxShadow="0 0 0 1px rgba(0,0,0,0.08)"
        objectFit="cover"
      />
    </Box>
  );
}
