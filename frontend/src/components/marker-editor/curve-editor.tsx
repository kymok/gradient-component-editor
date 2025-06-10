import { useCallback, useEffect, useRef, useState } from "react"
import styles from "./editor.module.css"
import { insertPoint, CurveControlPoint, updatePoint } from "../../utils/curve"
import { getCanvasRect, getRectTransform, Rect, unionRect } from "./utils/canvas"
import { Vector3 } from "three"
import { AddPointMarker, PointMarker } from "./marker"
import { useSvgElementDrag } from "./input/drag"
import { getToSvgLocal } from "./utils/svg-local"
import { getSelectionModifier } from "./input/modifierKeys"
import { clamp, findNearestPointOnLineSegment } from "./utils/math"
import { getSVGPaths } from "./utils/curve"
import { v4 as uuidv4 } from "uuid"
import { useCanvasSize } from "./utils/canvas-size-hooks"

const PADDING = 8;

export const CurveEditor = ({
  controlPoints,
  setControlPoints,
  selectedPointIds,
  setSelectedPointIds = () => {},
  defaultModelRect,
  controlPointBound,
  onRectChange,
  evaluationLocations,
}: {
  controlPoints: CurveControlPoint[],
  setControlPoints: React.Dispatch<React.SetStateAction<CurveControlPoint[]>>
  selectedPointIds: string[],
  setSelectedPointIds?: React.Dispatch<React.SetStateAction<string[]>>,
  defaultModelRect: Rect,
  controlPointBound: Rect,
  onRectChange?: (rect: Rect) => void,
  evaluationLocations: number[],
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const { width, height } = useCanvasSize(svgRef);
  const toSvgLocal = getToSvgLocal(svgRef);

  // inputs
  const { drag, isDragging } = useSvgElementDrag();
  const draggingCanvasPointsRef = useRef<{ id: string, x: number, y: number }[]>([]);
  const didControlPointsDraggedRef = useRef(false);
  const [newPointMarkerLocation, setNewPointMarkerLocation] = useState<{ x: number, y: number } | null>(null);

  // rects
  const paddingX = PADDING;
  const paddingY = PADDING;
  const canvasRect = getCanvasRect({ width, height, paddingX, paddingY });
  const controlPointBoundingBox: Rect = {
    xmin: Math.min(...controlPoints.map((p) => p.x)),
    xmax: Math.max(...controlPoints.map((p) => p.x)),
    ymin: Math.min(...controlPoints.map((p) => p.y)),
    ymax: Math.max(...controlPoints.map((p) => p.y)),
  };
  const modelRect = unionRect(defaultModelRect, controlPointBoundingBox);
  const modelToCanvasTransform = getRectTransform(modelRect, canvasRect);
  const canvasToModelTransform = getRectTransform(canvasRect, modelRect);
  useEffect(() => {
    if (onRectChange) {
      onRectChange({
        xmin: modelRect.xmin,
        xmax: modelRect.xmax,
        ymin: modelRect.ymin,
        ymax: modelRect.ymax,
      });
    }
  }, [modelRect.xmin, modelRect.xmax, modelRect.ymin, modelRect.ymax, onRectChange]);

  // transform points to canvas coordinates
  const convertToCanvasPoint = useCallback((point: CurveControlPoint) => {
    const v = new Vector3(point.x, point.y, 1);
    v.applyMatrix3(modelToCanvasTransform);
    return { ...point, x: v.x, y: v.y }
  }, [modelToCanvasTransform]);
  const canvasPoints = controlPoints.map(convertToCanvasPoint);
  const paths = getSVGPaths(canvasPoints, 32);

  // points to draw control point frame
  const controlFramePoints = [
    { id: 'START', x: canvasRect.xmin, y: canvasPoints[0].y, isSmooth: false },
    ...canvasPoints,
    { id: 'END', x: canvasRect.xmax, y: canvasPoints[canvasPoints.length - 1].y, isSmooth: false },
  ];

  // create point
  const handleCreatePointOnFrame = (
    x: number,
    y: number,
    from: CurveControlPoint,
    to: CurveControlPoint,
  ) => {
    const nearestPoint = findNearestPointOnLineSegment(
      from.x,
      from.y,
      to.x,
      to.y,
      x,
      y,
    );
    const v = new Vector3(nearestPoint.x, nearestPoint.y, 1);
    v.applyMatrix3(canvasToModelTransform);
    const newPointId = uuidv4();
    const newPoint = {
      id: newPointId,
      x: v.x,
      y: v.y,
      isSmooth: from.isSmooth || to.isSmooth,
    };
    const newPoints = insertPoint(controlPoints, newPoint);
    setControlPoints(newPoints);
    return newPoint;
  }

  // mouse events
  const handleMouseDownWithModifiers = (newPointId: string, event: MouseEvent) => {
    let newSelectedPointIds: string[] = [];
    const { isMultiSelectKeyPressed, isDeselectKeyPressed, isRangeSelectKeyPressed } = getSelectionModifier(event);
    if (isMultiSelectKeyPressed) {
      newSelectedPointIds = [...selectedPointIds, newPointId];
    } else if (isRangeSelectKeyPressed) {
      const last = selectedPointIds[selectedPointIds.length - 1];
      const lastIndex = controlPoints.findIndex((p) => p.id === last);
      const newIndex = controlPoints.findIndex((p) => p.id === newPointId);
      const newPoints = controlPoints.slice(
        Math.min(lastIndex, newIndex),
        Math.max(lastIndex, newIndex) + 1
      );
      newSelectedPointIds = [...selectedPointIds, ...newPoints.map((p) => p.id)];
    } else if (isDeselectKeyPressed) {
      newSelectedPointIds = selectedPointIds.filter(id => id !== newPointId);
    } else {
      if (!selectedPointIds.some(id => id === newPointId)) {
        newSelectedPointIds = [newPointId];
      }
      else {
        newSelectedPointIds = [...selectedPointIds];
      }
    }
    setSelectedPointIds(newSelectedPointIds);    
    return newSelectedPointIds;
  }

  const handleDragStart = () => {
    didControlPointsDraggedRef.current = true;
  };

  const handleDrag = useCallback((dx: number, dy: number) => {
    draggingCanvasPointsRef.current.forEach((point) => {
      const v = new Vector3(point.x + dx, point.y + dy, 1);
      v.applyMatrix3(canvasToModelTransform);
      setControlPoints((points) => updatePoint(points, {
          id: point.id,
          x: clamp(v.x, controlPointBound.xmin, controlPointBound.xmax),
          y: clamp(v.y, controlPointBound.ymin, controlPointBound.ymax),
        })
      );
    });
  }, [canvasToModelTransform, controlPointBound, setControlPoints]);

  const handleMouseUp = (newPointId: string, event: MouseEvent) => {
    const { isMultiSelectKeyPressed, isDeselectKeyPressed, isRangeSelectKeyPressed } = getSelectionModifier(event);
    if (!didControlPointsDraggedRef.current && !isMultiSelectKeyPressed && !isDeselectKeyPressed && !isRangeSelectKeyPressed) {
      setSelectedPointIds([newPointId]);
    }
    didControlPointsDraggedRef.current = false;
  };

  return (
    <div
      style={{
        width: `calc(100% + ${PADDING * 2}px)`,
        height: `calc(100% + ${PADDING * 2}px)`,
        margin: `-${PADDING}px`,
      }}
    >
      <svg ref={svgRef} width="100%" height="100%" className={styles.editorBackground}>

        {/* sampler locations */}
        {evaluationLocations.map((x, index) => {
          const v = new Vector3(x, 0, 1);
          v.applyMatrix3(modelToCanvasTransform);
          return (
            <line
              key={index}
              x1={v.x}
              y1={canvasRect.ymin}
              x2={v.x}
              y2={canvasRect.ymax}
              className={styles.samplerLine}
            />
          )
        })}

        {/* deselect catcher */}
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="transparent"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.button === 0) {
              setSelectedPointIds([]);
            }
          }}
        />

        {/* path */}
        {paths.map((path) => (
          <g key={path.fromPointId}>
            <path d={path.path} className={styles.pathBackdrop} />
          </g>
        ))}
        {paths.map((path) => (
          <g key={path.fromPointId}>
            <path d={path.path} className={styles.path} />
          </g>
        ))}

        {/* control point frame */}
        {controlFramePoints.map((p, i) => {
          if (i === 0) {
            return null;
          }
          const prev = controlFramePoints[i - 1];
          return (
            <g key={`${p.id}`}>
              <line
                x1={prev.x}
                y1={prev.y}
                x2={p.x}
                y2={p.y}
                className={styles.controlPointFrame}
              />
              <line
                x1={prev.x}
                y1={prev.y}
                x2={p.x}
                y2={p.y}
                stroke="transparent"
                strokeWidth={40}
                onMouseMove={(e) => {
                  const point = toSvgLocal(e.clientX, e.clientY);
                  if (!point) {
                    return;
                  }
                  const nearestPoint = findNearestPointOnLineSegment(
                    prev.x,
                    prev.y,
                    p.x,
                    p.y,
                    point.x,
                    point.y
                  );
                  setNewPointMarkerLocation({ x: nearestPoint.x, y: nearestPoint.y });
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const point = toSvgLocal(e.clientX, e.clientY);
                  if (!point) {
                    return;
                  }
                  const newPoint = handleCreatePointOnFrame(
                    point.x,
                    point.y,
                    prev,
                    p,
                  );
                  const newSelectedPointIds = handleMouseDownWithModifiers(newPoint.id, e.nativeEvent);
                  const newCanvasPoint = convertToCanvasPoint(newPoint);
                  draggingCanvasPointsRef.current = [
                    ...canvasPoints,
                    newCanvasPoint, // should be added manually when creating a new point
                  ].filter(
                    point => newSelectedPointIds.includes(point.id)
                  ).map(
                    point => ({ id: point.id, x: point.x, y: point.y })
                  );
                  drag({
                    event: e,
                    offset: [newCanvasPoint.x - e.clientX, newCanvasPoint.y - e.clientY],
                    onDragStart: handleDragStart,
                    onDrag: ({ dx, dy }) => {
                      handleDrag(dx, dy);
                    },
                  })
                }}
                onMouseLeave={() => {
                  setNewPointMarkerLocation(null);
                }}
              />
            </g>
          )
        })}

        {/* control points */}
        {canvasPoints.map((p) => {
          return (
            <PointMarker
              key={p.id}
              cx={p.x}
              cy={p.y}
              isSmooth={p.isSmooth}
              isActive={selectedPointIds?.some(id => id === p.id)}
              onMouseUp={(e) => {
                // deselect all other points if drag did not happen.
                handleMouseUp(p.id, e.nativeEvent);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const newSelectedPointIds = handleMouseDownWithModifiers(p.id, e.nativeEvent);
                draggingCanvasPointsRef.current = canvasPoints.filter(
                  point => newSelectedPointIds.some(id => id === point.id)
                ).map(
                  point => ({ id: point.id, x: point.x, y: point.y })
                );
                drag({
                  event: e,
                  offset: [p.x - e.clientX, p.y - e.clientY],
                  onDragStart: handleDragStart,
                  onDrag: ({ dx, dy }) => {
                    handleDrag(dx, dy);
                  },
                })
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                setControlPoints((points) => {
                  const newPoints = [...points];
                  const index = newPoints.findIndex((point) => point.id === p.id);
                  if (index !== -1) {
                    newPoints[index] = { ...newPoints[index], isSmooth: !newPoints[index].isSmooth };
                  }
                  return newPoints;
                })
              }}
            />
          )
        })}

        {/* add point marker */}
        {newPointMarkerLocation !== null && !isDragging && (
          <AddPointMarker cx={newPointMarkerLocation.x} cy={newPointMarkerLocation.y} />
        )}
      </svg>
    </div>
  )
}
