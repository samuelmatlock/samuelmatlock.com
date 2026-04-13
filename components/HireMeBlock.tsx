import { Box, Text, Link } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

const ORB_SIZE = 6;
const SPEED = 1.5;
const BORDER_RADIUS = 6; // matches Chakra "md"

function getOrbPos(w: number, h: number, progress: number) {
  const r = BORDER_RADIUS;
  const arcLen = (Math.PI / 2) * r;
  const topLen = w - 2 * r;
  const rightLen = h - 2 * r;
  const bottomLen = w - 2 * r;
  const leftLen = h - 2 * r;

  const segments = [topLen, arcLen, rightLen, arcLen, bottomLen, arcLen, leftLen, arcLen];
  const perimeter = segments.reduce((a, b) => a + b, 0);
  const p = ((progress % perimeter) + perimeter) % perimeter;

  let remaining = p;
  let seg = 0;
  while (seg < segments.length - 1 && remaining >= segments[seg]) {
    remaining -= segments[seg];
    seg++;
  }

  const t = remaining / segments[seg];
  const half = ORB_SIZE / 2;
  let cx = 0, cy = 0;

  switch (seg) {
    case 0: cx = r + t * topLen; cy = 0; break;
    case 1: { const a = -Math.PI / 2 + t * Math.PI / 2; cx = (w - r) + r * Math.cos(a); cy = r + r * Math.sin(a); break; }
    case 2: cx = w; cy = r + t * rightLen; break;
    case 3: { const a = t * Math.PI / 2; cx = (w - r) + r * Math.cos(a); cy = (h - r) + r * Math.sin(a); break; }
    case 4: cx = (w - r) - t * bottomLen; cy = h; break;
    case 5: { const a = Math.PI / 2 + t * Math.PI / 2; cx = r + r * Math.cos(a); cy = (h - r) + r * Math.sin(a); break; }
    case 6: cx = 0; cy = (h - r) - t * leftLen; break;
    case 7: { const a = Math.PI + t * Math.PI / 2; cx = r + r * Math.cos(a); cy = r + r * Math.sin(a); break; }
  }

  return { x: cx - half, y: cy - half };
}

export function HireMeBlock() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const rafRef = useRef<number>();
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const step = () => {
      const el = containerRef.current;
      if (el) {
        progressRef.current += SPEED;
        setPos(getOrbPos(el.offsetWidth, el.offsetHeight, progressRef.current));
      }
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
      width="100%"
      pr={{ base: 5, md: 16 }}
      overflow="visible"
    >
      <Box
        position="absolute"
        w={`${ORB_SIZE}px`}
        h={`${ORB_SIZE}px`}
        borderRadius="full"
        bg="whiteAlpha.500"
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
        >
          LinkedIn
        </Link>{" "}
        and{" "}
        <Link
          href="https://www.samuelmatlock.com/SamuelMatlockResume.pdf"
          isExternal
          fontWeight="bold"
          sx={{ color: "white !important", textDecoration: "underline !important", textDecorationColor: "rgba(255,255,255,0.7) !important" }}
        >
          Résumé
        </Link>
        .
      </Text>
    </Box>
  );
}
