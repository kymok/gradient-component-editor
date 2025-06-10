import { Matrix3 } from "three";

export type CanvasDimensions = {
  width: number;
  height: number;
  paddingX: number;
  paddingY: number;
}

export type Rect = {
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
}

export const unionRect = (rect1: Rect, rect2: Rect): Rect => {
  return {
    xmin: Math.min(rect1.xmin, rect2.xmin),
    xmax: Math.max(rect1.xmax, rect2.xmax),
    ymin: Math.min(rect1.ymin, rect2.ymin),
    ymax: Math.max(rect1.ymax, rect2.ymax),
  };
}

export const getCanvasRect = (canvasDimensions: CanvasDimensions): Rect => {
  const { width, height, paddingX, paddingY } = canvasDimensions;
  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingY * 2;
  return {
    xmin: paddingX,
    xmax: paddingX + innerWidth,
    ymin: paddingY + innerHeight, // Invert Y axis
    ymax: paddingY,
  };
}

export const getRectTransform = (
  rect1: Rect,
  rect2: Rect,
): Matrix3 => {
  const scaleX = (rect2.xmax - rect2.xmin) / (rect1.xmax - rect1.xmin);
  const scaleY = (rect2.ymax - rect2.ymin) / (rect1.ymax - rect1.ymin);
  const translateX = rect2.xmin - rect1.xmin * scaleX;
  const translateY = rect2.ymin - rect1.ymin * scaleY;
  return new Matrix3().set(
    scaleX, 0, translateX,
    0, scaleY, translateY,
    0, 0, 1
  );
}
