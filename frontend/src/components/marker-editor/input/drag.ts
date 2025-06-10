import React, { useRef, useState } from "react";

export const useSvgElementDrag = () => {
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDragStartedRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const drag = ({
    event,
    offset = [0, 0],
    onDragStart,
    onDrag,
    onDragEnd,
    threshold = 0,
  }: {
    event: React.MouseEvent
    offset?: [number, number]
    onDragStart?: (e: MouseEvent) => void
    onDrag?: ({ event, x, y, dx, dy }: { event: MouseEvent, x: number, y: number, dx: number, dy: number }) => void
    onDragEnd?: (e: MouseEvent) => void
    threshold?: number
  }) => {
    const handleMouseMove = (event: MouseEvent) => {
      const dx = event.clientX - dragStartRef.current.x;
      const dy = event.clientY - dragStartRef.current.y;
      if (!isDragStartedRef.current && (dx ** 2 + dy ** 2 > threshold ** 2)) {
        isDragStartedRef.current = true;
        setIsDragging(true);
        if (onDragStart) {
          onDragStart(event);
        }
      }
      if (onDrag) {
        onDrag({ event, x: event.clientX + offset[0], y: event.clientY + offset[1], dx, dy });
      }
    };
    const handleMouseUp = (event: MouseEvent) => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      isDragStartedRef.current = false;
      setIsDragging(false);
      if (onDragEnd) {
        onDragEnd(event);
      }
    };
    const handleMouseDown = (event: React.MouseEvent) => {
      dragStartRef.current = { x: event.clientX, y: event.clientY };
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    handleMouseDown(event);
  }
  return { drag, isDragging };
}