import { Box, Text, Link } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

const TRAIL_LENGTH = 18;
const SPEED = 6;
const SPAWN_INTERVAL = 2000; // ms between spawns

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  phase: "in" | "travel" | "out";
  trail: { x: number; y: number }[];
}

function spawnStar(w: number, h: number): ShootingStar {
  const angle = Math.random() * Math.PI * 2;
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: Math.cos(angle) * SPEED,
    vy: Math.sin(angle) * SPEED,
    opacity: 0,
    phase: "in",
    trail: [],
  };
}

export function HireMeBlock() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<ShootingStar[]>([]);
  const rafRef = useRef<number>();
  const lastSpawnRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const draw = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn a new star every SPAWN_INTERVAL ms
      if (timestamp - lastSpawnRef.current > SPAWN_INTERVAL) {
        starsRef.current.push(spawnStar(canvas.width, canvas.height));
        lastSpawnRef.current = timestamp;
      }

      starsRef.current = starsRef.current.filter((star) => {
        // Update trail
        star.trail.unshift({ x: star.x, y: star.y });
        if (star.trail.length > TRAIL_LENGTH) star.trail.pop();

        // Move
        star.x += star.vx;
        star.y += star.vy;

        // Fade in quickly, then fade out as it leaves bounds
        if (star.phase === "in") {
          star.opacity = Math.min(1, star.opacity + 0.12);
          if (star.opacity >= 1) star.phase = "travel";
        }

        const outOfBounds =
          star.x > canvas.width + 20 ||
          star.y > canvas.height + 20 ||
          star.x < -20;

        if (outOfBounds || star.phase === "out") {
          star.phase = "out";
          star.opacity = Math.max(0, star.opacity - 0.08);
          if (star.opacity <= 0) return false;
        }

        // Draw trail
        for (let i = 0; i < star.trail.length; i++) {
          const t = star.trail[i];
          const alpha = star.opacity * (1 - i / star.trail.length) * 0.6;
          const radius = 1.5 * (1 - i / star.trail.length);
          ctx.beginPath();
          ctx.arc(t.x, t.y, Math.max(0.1, radius), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
          ctx.fill();
        }

        // Draw head glow
        const grd = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 5);
        grd.addColorStop(0, `rgba(255,255,255,${star.opacity * 0.9})`);
        grd.addColorStop(1, `rgba(255,255,255,0)`);
        ctx.beginPath();
        ctx.arc(star.x, star.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Draw head dot
        ctx.beginPath();
        ctx.arc(star.x, star.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${star.opacity})`;
        ctx.fill();

        return true;
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
