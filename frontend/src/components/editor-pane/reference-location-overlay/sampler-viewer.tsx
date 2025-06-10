import { useCallback, useRef } from "react";
import { useCanvasSize } from "../../marker-editor/utils/canvas-size-hooks";
import { getCanvasRect, getRectTransform } from "../../marker-editor/utils/canvas";
import { Vector3 } from "three";
import { Reference } from "../../../store/types";
import { getContrastColor } from "./utils";

const PADDING = 8;

export const ReferenceLocationOverlay = ({
  references,
}: {
  references: Reference[];
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { width, height } = useCanvasSize(svgRef);

  // rects
  const paddingX = PADDING;
  const paddingY = PADDING;
  const canvasRect = getCanvasRect({ width, height, paddingX, paddingY });
  const modelRect = {
    xmin: 0,
    ymin: 0,
    xmax: 1,
    ymax: 1,
  };
  const modelToCanvasTransform = getRectTransform(modelRect, canvasRect);
  const convertToCanvasPoint = useCallback((t: number) => {
    const v = new Vector3(t, 0.5, 1);
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
            const { x, y } = convertToCanvasPoint(ref.match.t);
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
          })}
        </g>
      </svg>
    </div>
  )
}