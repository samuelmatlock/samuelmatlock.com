import { Box, Text, Link } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

const ORB_SIZE = 6;
const SPEED = 1.1;

export function HireMeBlock() {
  const containerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 20, y: 0 });
  const velRef = useRef({ x: SPEED, y: SPEED * 0.7 });
  const rafRef = useRef<number>();
  const [pos, setPos] = useState({ x: 20, y: 0 });

  useEffect(() => {
    const step = () => {
      const el = containerRef.current;
      if (!el) { rafRef.current = requestAnimationFrame(step); return; }

      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const maxX = w - ORB_SIZE;
      const maxY = h - ORB_SIZE;

      let { x, y } = posRef.current;
      let { x: vx, y: vy } = velRef.current;

      x += vx;
      y += vy;

      if (x <= 0) { x = 0; vx = Math.abs(vx); }
      if (x >= maxX) { x = maxX; vx = -Math.abs(vx); }
      if (y <= 0) { y = 0; vy = Math.abs(vy); }
      if (y >= maxY) { y = maxY; vy = -Math.abs(vy); }

      posRef.current = { x, y };
      velRef.current = { x: vx, y: vy };
      setPos({ x, y });

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <Box
      ref={containerRef}
      position="relative"
      bg="gray.900"
      borderRadius="md"
      px={5}
      py={4}
      mt={1}
      display={{ base: "block", md: "inline-block" }}
      pr={{ base: 5, md: 16 }}
      overflow="hidden"
    >
      {/* Bouncing orb */}
      <Box
        position="absolute"
        w={`${ORB_SIZE}px`}
        h={`${ORB_SIZE}px`}
        borderRadius="full"
        bg="whiteAlpha.400"
        pointerEvents="none"
        style={{
          top: pos.y,
          left: pos.x,
          boxShadow: "0 0 6px 3px rgba(255,255,255,0.3), 0 0 12px 5px rgba(255,255,255,0.1)",
        }}
      />

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
