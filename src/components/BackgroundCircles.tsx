import React, { useEffect, useState } from "react";

interface Circle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
  scale: number;
}

interface BackgroundCirclesProps {
  count?: number;
  minSize?: number;
  maxSize?: number;
  minOpacity?: number;
  maxOpacity?: number;
  color?: string;
  animated?: boolean;
}

const BackgroundCircles: React.FC<BackgroundCirclesProps> = ({
  count = 15,
  minSize = 50,
  maxSize = 200,
  minOpacity = 0.1,
  maxOpacity = 0.3,
  color = "#005A8D",
  animated = true,
}) => {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Generate random circles
  useEffect(() => {
    const generateCircles = () => {
      const newCircles: Circle[] = [];
      for (let i = 0; i < count; i++) {
        newCircles.push({
          id: i,
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
          size: minSize + Math.random() * (maxSize - minSize),
          opacity: minOpacity + Math.random() * (maxOpacity - minOpacity),
          speedX: (Math.random() - 0.5) * 0.2,
          speedY: (Math.random() - 0.5) * 0.2,
          scale: 0.95 + Math.random() * 0.1,
        });
      }
      setCircles(newCircles);
    };

    generateCircles();

    // Update circles when window is resized
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      generateCircles();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [
    count,
    minSize,
    maxSize,
    minOpacity,
    maxOpacity,
    dimensions.width,
    dimensions.height,
  ]);

  // Animation effect
  useEffect(() => {
    if (!animated) return;

    let animationFrameId: number;

    const animate = () => {
      setCircles((prevCircles) =>
        prevCircles.map((circle) => {
          // Move circles
          let newX = circle.x + circle.speedX;
          let newY = circle.y + circle.speedY;

          // Bounce off edges
          if (newX < 0 || newX > dimensions.width) {
            newX = Math.max(0, Math.min(newX, dimensions.width));
            circle.speedX *= -1;
          }

          if (newY < 0 || newY > dimensions.height) {
            newY = Math.max(0, Math.min(newY, dimensions.height));
            circle.speedY *= -1;
          }

          // Pulse effect - subtle scale change
          const newScale =
            circle.scale + Math.sin(Date.now() / 2000 + circle.id) * 0.01;

          return {
            ...circle,
            x: newX,
            y: newY,
            scale: newScale,
          };
        }),
      );

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [animated, dimensions.width, dimensions.height]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#0B0B39]">
      {circles.map((circle) => (
        <div
          key={circle.id}
          className="absolute rounded-full transition-opacity duration-1000"
          style={{
            left: `${circle.x}px`,
            top: `${circle.y}px`,
            width: `${circle.size}px`,
            height: `${circle.size}px`,
            backgroundColor: color,
            opacity: circle.opacity,
            transform: `translate(-50%, -50%) scale(${circle.scale || 1})`,
            transition: animated ? "transform 2s ease-in-out" : "none",
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundCircles;
