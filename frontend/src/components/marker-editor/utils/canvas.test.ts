import { it, expect } from "vitest";
import { getCanvasRect } from "./canvas";

it("getCanvasRect", () => {
  const canvasDimensions = {
    width: 200,
    height: 100,
    paddingX: 20,
    paddingY: 10,
  };
  const rect = getCanvasRect(canvasDimensions);
  expect(rect).toEqual({
    xmin: 20,
    xmax: 180,
    ymin: 90,
    ymax: 10,
  });
});
