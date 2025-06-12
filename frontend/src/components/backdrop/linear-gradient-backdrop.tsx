import { useEffect, useRef } from "react";
import { lchToRgbWithGamutMapping } from "./lchToRgb";

const OUT_OF_GAMUT_ALPHA = 1;
const OUT_OF_GAMUT_COLOR = 240 * (1 - OUT_OF_GAMUT_ALPHA);

export const LinearGradientBackdrop = (props: {
  lchValues: number[][],
  gamut: "srgb" | "display-p3",
  direction: "horizontal" | "vertical",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));

  useEffect(() => {
    canvasRef.current.width = props.direction === "horizontal" ? props.lchValues.length : 1;
    canvasRef.current.height = props.direction === "horizontal" ? 1 : props.lchValues.length;
    const ctx = canvasRef.current?.getContext("2d", { colorSpace: props.gamut });
    // const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) {
      return;
    }
    const imageData = ctx.createImageData(canvasRef.current.width, canvasRef.current.height, { colorSpace: props.gamut });
    const data = imageData.data;
    const lchValues = props.lchValues;
    lchValues.forEach(([l, c, h], index) => {
      const [r, g, b, isInGamut] = lchToRgbWithGamutMapping(l, c, h, props.gamut);
      if (isInGamut) {
        data[index * 4] = Math.round(r * 255);
        data[index * 4 + 1] = Math.round(g * 255);
        data[index * 4 + 2] = Math.round(b * 255);
        data[index * 4 + 3] = 255;
      }
      else {
        data[index * 4] = Math.round(r * 255 * OUT_OF_GAMUT_ALPHA + OUT_OF_GAMUT_COLOR);
        data[index * 4 + 1] = Math.round(g * 255 * OUT_OF_GAMUT_ALPHA + OUT_OF_GAMUT_COLOR);
        data[index * 4 + 2] = Math.round(b * 255 * OUT_OF_GAMUT_ALPHA + OUT_OF_GAMUT_COLOR);
        data[index * 4 + 3] = 255;
      }
    });
    ctx.putImageData(imageData, 0, 0);
  }, [props.direction, props.gamut, props.lchValues]);

  return (<canvas
    ref={canvasRef}
    style={{
      width: "100%",
      height: "100%",
    }}
  />);
}