import { useCallback, useRef, useState } from "react";
import { useCanvasSize } from "./utils/canvas-size-hooks";
import { getCanvasRect, getRectTransform } from "./utils/canvas";
import { Vector3 } from "three";
import { AddPointMarker, LinearEditorPointMarker } from "./marker";
import { getSelectionModifier } from "./input/modifierKeys";
import { useSvgElementDrag } from "./input/drag";
import { insertPoint, LinearControlPoint, updatePoint } from "../../utils/linear";
import { clamp } from "./utils/math";
import { getToSvgLocal } from "./utils/svg-local";
import { v4 as uuidv4 } from "uuid";

const PADDING = 8;

export const LinearEditor = <T,>({
  controlPoints,
  setControlPoints,
  selectedPointIds,
  setSelectedPointIds = () => {},
  getValue,
  unsmoothOnDrag = false,
  smoothOnCreate = true,
  smoothMarkerSize = "normal",
}: {
  controlPoints: LinearControlPoint<T>[];
  setControlPoints: React.Dispatch<React.SetStateAction<LinearControlPoint<T>[]>>;
  selectedPointIds: string[];
  setSelectedPointIds?: React.Dispatch<React.SetStateAction<string[]>>;
  getValue: (t: number) => T;
  unsmoothOnDrag?: boolean;
  smoothOnCreate?: boolean;
  smoothMarkerSize?: "small" | "normal";
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
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
  const modelRect = {
    xmin: 0,
    ymin: 0,
    xmax: 1,
    ymax: 1,
  };
  const modelToCanvasTransform = getRectTransform(modelRect, canvasRect);
  const canvasToModelTransform = getRectTransform(canvasRect, modelRect);
  const controlPointBound = {
    xmin: 0,
    ymin: 0,
    xmax: 1,
    ymax: 1,
  };

  // transform points to canvas coordinates
  const convertToCanvasPoint = useCallback((point: LinearControlPoint<T>) => {
    const v = new Vector3(point.t, 0.5, 1);
    v.applyMatrix3(modelToCanvasTransform);
    return { ...point, x: v.x, y: v.y }
  }, [modelToCanvasTransform]);
  const canvasPoints = controlPoints.map(convertToCanvasPoint);

  // create point
  const handleCreatePointOnFrame = (x: number) => {
    const v = new Vector3(x, (canvasRect.ymin + canvasRect.ymax) / 2, 1);
    v.applyMatrix3(canvasToModelTransform);
    const t = clamp(v.x, controlPointBound.xmin, controlPointBound.xmax);
    const newPoint: LinearControlPoint<T> = {
      id: uuidv4(),
      t,
      isSmooth: smoothOnCreate,
      value: getValue(t),
    }
    setControlPoints((points) => insertPoint(points, newPoint));
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

  const handleDrag = useCallback((dx: number) => {
    draggingCanvasPointsRef.current.forEach((point) => {
      const v = new Vector3(point.x + dx, point.y, 1);
      v.applyMatrix3(canvasToModelTransform);
      const p = controlPoints.find((p) => p.id === point.id);
      const newPoint = {
        id: point.id,
        t: clamp(v.x, controlPointBound.xmin, controlPointBound.xmax),
        isSmooth: unsmoothOnDrag ? false : (p?.isSmooth ?? false),
      };
      setControlPoints((points) => updatePoint(points, newPoint));
    });
  }, [canvasToModelTransform, controlPointBound.xmax, controlPointBound.xmin, controlPoints, setControlPoints, unsmoothOnDrag]);

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
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
      >
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

        <line
          x1={canvasRect.xmin}
          y1={(canvasRect.ymin + canvasRect.ymax) / 2}
          x2={canvasRect.xmax}
          y2={(canvasRect.ymin + canvasRect.ymax) / 2}
          stroke="transparent"
          strokeWidth={30}
          onMouseMove={(e) => {
            const point = toSvgLocal(e.clientX, e.clientY);
            if (!point) {
              return;
            }
            const { x } = point;
            setNewPointMarkerLocation({ x, y: (canvasRect.ymin + canvasRect.ymax) / 2 });
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const point = toSvgLocal(e.clientX, e.clientY);
            if (!point) {
              return;
            }
            const { x } = point;
            const newPoint = handleCreatePointOnFrame(x);
            const newSelectedPointIds = handleMouseDownWithModifiers(newPoint.id, e.nativeEvent);
            const newCanvasPoint = convertToCanvasPoint(newPoint);
            draggingCanvasPointsRef.current = [
              ...canvasPoints,
              newCanvasPoint, // should be added manually when creating a new point
            ].filter(
              p => newSelectedPointIds.includes(p.id)
            ).map(
              p => ({
                id: p.id,
                x: p.x,
                y: p.y,
              })
            );
            drag({
              event: e,
              offset: [newCanvasPoint.x - e.clientX, newCanvasPoint.y - e.clientY],
              onDragStart: handleDragStart,
              onDrag: ({ dx }) => {
                handleDrag(dx);
              },
            });
          }}
          onMouseLeave={() => {
            setNewPointMarkerLocation(null);
          }}
        />

        {/* Markers */}
        {canvasPoints.map((canvasPoint) => (
          <LinearEditorPointMarker
            key={canvasPoint.id}
            cx={canvasPoint.x}
            cy={canvasPoint.y}
            isSmooth={canvasPoint.isSmooth}
            isActive={selectedPointIds.some(id => id === canvasPoint.id)}
            smoothmarkersize={smoothMarkerSize}
            onMouseUp={(e) => handleMouseUp(canvasPoint.id, e.nativeEvent)}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const newSelectedPointIds = handleMouseDownWithModifiers(canvasPoint.id, e.nativeEvent);
              draggingCanvasPointsRef.current = canvasPoints.filter(p => newSelectedPointIds.includes(p.id));
              drag({
                event: e,
                offset: [canvasPoint.x - e.clientX, canvasPoint.y - e.clientY],
                onDragStart: handleDragStart,
                onDrag: ({ dx }) => {
                  handleDrag(dx);
                },
              })
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              const v = new Vector3(canvasPoint.x, canvasPoint.y, 1);
              v.applyMatrix3(canvasToModelTransform);
              const t = clamp(v.x, controlPointBound.xmin, controlPointBound.xmax);
              const newPoint: Partial<LinearControlPoint<T>> & { id: string } = {
                id: canvasPoint.id,
                t,
                isSmooth: !canvasPoint.isSmooth,
              }
              setControlPoints((points) => updatePoint(points, newPoint));
            }}
          />
        ))}

        {/* add point marker */}
        {newPointMarkerLocation !== null && !isDragging && (
          <AddPointMarker cx={newPointMarkerLocation.x} cy={newPointMarkerLocation.y} />
        )}
      </svg>
    </div>
  )
}