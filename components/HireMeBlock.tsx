import { Box, Text, Link } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

const STAR_COUNT = 3;

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  targetOpacity: number;
  speed: number;
}

function initStars(w: number, h: number): Star[] {
  return Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    size: 0.8 + Math.random() * 1.2,
    opacity: Math.random(),
    targetOpacity: Math.random(),
    speed: 0.012 + Math.random() * 0.018,
  }));
}

export function HireMeBlock() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      starsRef.current = initStars(canvas.width, canvas.height);
    };
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      starsRef.current.forEach((star) => {
        star.opacity += (star.targetOpacity - star.opacity) * star.speed * 3;

        if (Math.abs(star.opacity - star.targetOpacity) < 0.02) {
          if (star.targetOpacity < 0.05) {
            // Fully faded out — move to new random position then fade back in
            star.x = Math.random() * canvas.width;
            star.y = Math.random() * canvas.height;
            star.targetOpacity = 0.6 + Math.random() * 0.4;
          } else {
            // Fully faded in — fade back out
            star.targetOpacity = 0;
          }
        }

        const alpha = Math.max(0, Math.min(1, star.opacity));

        // Glow
        const grd = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 4);
        grd.addColorStop(0, `rgba(255,255,255,${alpha * 0.6})`);
        grd.addColorStop(1, `rgba(255,255,255,0)`);
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, []);

  return (
    <Box
      position="relative"
      bg="gray.900"
      borderRadius="md"
      px={5}
      py={4}
      mt={1}
      width="100%"
      pr={{ base: 5, md: 16 }}
      overflow="hidden"
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
      <Text position="relative" color="gray.200" lineHeight={1.75} fontSize={{ base: "xs", md: "sm" }}>
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
