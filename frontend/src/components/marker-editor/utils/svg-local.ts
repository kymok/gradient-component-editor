export const getToSvgLocal = (
  svgRef: React.RefObject<SVGSVGElement | null>
): (x: number, y: number) => (DOMPoint | null) => {
  return (x: number, y: number) => {
    const svg = svgRef.current;
    if (!svg) {
      return null;
    }
    const ctx = svg.getScreenCTM();
    if (!ctx) {
      return null;
    }
    const point = svg.createSVGPoint();
    point.x = x;
    point.y = y;

    const inv = svg.getScreenCTM()?.inverse();
    return inv ? point.matrixTransform(inv) : null; // {x, y}
  }
};