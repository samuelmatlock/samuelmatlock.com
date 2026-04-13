import { Box, Text, Link } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

const ORB_SIZE = 6;
const SPEED = 0.6; // px per frame along perimeter

export function HireMeBlock() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0); // distance along perimeter
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number>();

  useEffect(() => {
    const step = () => {
      const el = containerRef.current;
      if (!el) { rafRef.current = requestAnimationFrame(step); return; }

      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const perimeter = 2 * (w + h);

      progressRef.current = (progressRef.current + SPEED) % perimeter;
      const p = progressRef.current;

      let x = 0, y = 0;
      if (p < w) {
        // top edge left→right
        x = p;
        y = 0;
      } else if (p < w + h) {
        // right edge top→bottom
        x = w - ORB_SIZE;
        y = p - w;
      } else if (p < 2 * w + h) {
        // bottom edge right→left
        x = w - ORB_SIZE - (p - w - h);
        y = h - ORB_SIZE;
      } else {
        // left edge bottom→top
        x = 0;
        y = h - ORB_SIZE - (p - 2 * w - h);
      }

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
      {/* Perimeter orb */}
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
