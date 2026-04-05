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

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing;
          const y = j * spacing;

          // Layered sine waves at different angles/frequencies for organic topo contours
          const wave =
            Math.sin(x * 0.018 + y * 0.011) * 0.38 +
            Math.sin(x * 0.011 - y * 0.019 + 1.3) * 0.32 +
            Math.cos(x * 0.007 + y * 0.023 + 0.6) * 0.2 +
            Math.cos(x * 0.022 - y * 0.008 + 2.1) * 0.1;

          const t = (wave + 1) / 2; // normalize to [0, 1]

          const minR = 0.5;
          const maxR = spacing * 0.42;
          const radius = minR + t * (maxR - minR);

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
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
