import React from "react";

export function GeometricBackground() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const spacing = 13;
      const cols = Math.ceil(canvas.width / spacing) + 2;
      const rows = Math.ceil(canvas.height / spacing) + 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- Value noise implementation (no library needed) ---
      const cache: Record<string, number> = {};

      function gridVal(ix: number, iy: number): number {
        const key = `${ix},${iy}`;
        if (cache[key] === undefined) {
          const n = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453;
          cache[key] = n - Math.floor(n);
        }
        return cache[key];
      }

      function smoothstep(t: number): number {
        return t * t * (3 - 2 * t);
      }

      function noise2d(nx: number, ny: number): number {
        const ix = Math.floor(nx);
        const iy = Math.floor(ny);
        const fx = nx - ix;
        const fy = ny - iy;
        const ux = smoothstep(fx);
        const uy = smoothstep(fy);
        return (
          gridVal(ix, iy) * (1 - ux) * (1 - uy) +
          gridVal(ix + 1, iy) * ux * (1 - uy) +
          gridVal(ix, iy + 1) * (1 - ux) * uy +
          gridVal(ix + 1, iy + 1) * ux * uy
        );
      }

      // Fractal brownian motion — multiple octaves for terrain-like detail
      function fbm(x: number, y: number): number {
        let val = 0;
        let amp = 0.5;
        let freq = 1;
        for (let o = 0; o < 6; o++) {
          val += noise2d(x * freq, y * freq) * amp;
          amp *= 0.5;
          freq *= 2.1;
        }
        return val; // ~[0, 1]
      }

      // Large-scale "continental" noise — controls where the big land masses are
      const continentalScale = 120;
      // Mid-scale variation within continents
      const detailScale = 45;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing;
          const y = j * spacing;

          const continental = fbm(x / continentalScale, y / continentalScale);
          const detail = fbm(x / detailScale + 5.3, y / detailScale + 2.7);

          // Combine: continental drives big structure, detail adds texture
          const combined = continental * 0.7 + detail * 0.3;

          // Sharpen contrast — raises highs and drops lows for true void/dense split
          const shaped = Math.pow(combined, 1.8);

          // True voids: skip drawing below threshold
          const voidThreshold = 0.18;
          if (shaped < voidThreshold) continue;

          // Map remainder to radius — small max so dots stay small
          const tLocal = (shaped - voidThreshold) / (1 - voidThreshold);
          const maxR = spacing * 0.26;
          const minR = 0.3;
          const radius = minR + tLocal * (maxR - minR);

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0, 0, 0, 0.10)";
          ctx.fill();
        }
      }
    };

    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}
