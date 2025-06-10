import { useCallback, useRef } from "react";
import { useCanvasSize } from "../../marker-editor/utils/canvas-size-hooks";
import { getCanvasRect, getRectTransform, Rect } from "../../marker-editor/utils/canvas";
import { Vector3 } from "three";
import { Reference } from "../../../store/types";
import { convert, OKLab, OKLCH } from "@texel/color";
import { getContrastColor } from "./utils";

const PADDING = 8;

export const ReferenceLocationOverlay = ({
  references,
  rect,
  yAxis,
}: {
  references: Reference[];
  rect: Rect;
  yAxis: 'l' | 'c' | 'h';
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { width, height } = useCanvasSize(svgRef);

  // rects
  const paddingX = PADDING;
  const paddingY = PADDING;
  const canvasRect = getCanvasRect({ width, height, paddingX, paddingY });
  const modelRect = rect;
  const modelToCanvasTransform = getRectTransform(modelRect, canvasRect);
  const convertToCanvasPoint = useCallback((x: number, y: number) => {
    const v = new Vector3(x, y, 1);
    v.applyMatrix3(modelToCanvasTransform);
    return { x: v.x, y: v.y }
  }, [modelToCanvasTransform]);

  return (
    <div
      style={{
        width: `calc(100% + ${PADDING * 2}px)`,
        height: `calc(100% + ${PADDING * 2}px)`,
        margin: `-${PADDING}px`,
      }}
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
      >
        <g>
          {references.map((ref, index) => {
            const referenceLch = convert(ref.oklabColor, OKLab, OKLCH);
            let markerY: number;
            if (yAxis === 'l') {
              markerY = referenceLch[0];
            } else if (yAxis === 'c') {
              markerY = referenceLch[1];
            } else if (yAxis === 'h') {
              markerY = referenceLch[2];
            } else {
              throw new Error(`Unknown curveY: ${yAxis}`);
            }

            if (yAxis === 'l' || yAxis === 'c') {
              const { x, y } = convertToCanvasPoint(ref.match.t, markerY);
              return (
                <g key={'group-' + index}>
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r={8}
                    fill={ref.color}
                  />
                  <text
                    key={`text-${index}`}
                    x={x}
                    y={y}
                    fontSize="10"
                    fill={getContrastColor(ref.oklabColor)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{ userSelect: "none" }}
                  >
                    {index + 1}
                  </text>
                </g>
              );
            }
            else if (yAxis === 'h') {
              const hueCycleMin = Math.floor(rect.ymin / 360);
              const hueCycleMax = Math.ceil(rect.ymax / 360);
              const nCycles = (hueCycleMax - hueCycleMin) - 1;
              const wrappedMarkers = Array.from({ length: nCycles + 1 }, (_, i) => {
                const cycle = hueCycleMin + i;
                const hue = (referenceLch[2] + cycle * 360);
                if (hue < rect.ymin || hue > rect.ymax) {
                  return null; // Skip markers outside the range
                }
                const { x, y } = convertToCanvasPoint(ref.match.t, hue);
                return (
                  <g key={`hue-${index}-${i}`}>
                    <circle
                      cx={x}
                      cy={y}
                      r={8}
                      fill={ref.color}
                    />
                    <text
                      x={x}
                      y={y}
                      fontSize="10"
                      fill={getContrastColor(ref.oklabColor)}
                      textAnchor="middle"
                      dominantBaseline="central"
                      style={{ userSelect: "none" }}
                    >
                      {index + 1}
                    </text>
                  </g>
                );
              })
              return (
                <g key={'group-' + index}>
                  {wrappedMarkers}
                </g>
              );
            }
          })}
        </g>
      </svg>
    </div>
  )
}