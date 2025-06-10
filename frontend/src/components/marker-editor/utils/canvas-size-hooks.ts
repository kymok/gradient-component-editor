import { useState, useLayoutEffect } from "react";

export const useCanvasSize = (svgRef: React.RefObject<SVGSVGElement | null>) => {
  const [size, setSize] = useState({ width: 0, height: 0 })
  useLayoutEffect(() => {
    const svg = svgRef.current
    if (!svg) {
      return;
    }
    const update = () => {
      const { width, height } = svg.getBoundingClientRect();
      setSize({ width, height });
    }
    const ro = new ResizeObserver(update);
    ro.observe(svg);
    update();
    return () => {
      ro.disconnect();
    }
  }, [svgRef])
  return { width: size.width, height: size.height }
}