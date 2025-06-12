import { useEffect, useRef } from "react";
import { lchToLinearRgb } from "./lchToRgb";

const sRGBLinearToGamma = (val: number) => {
  const sign = val < 0 ? -1 : 1;
  const abs = Math.abs(val);
  return abs > 0.0031308
    ? sign * (1.055 * Math.pow(abs, 1 / 2.4) - 0.055)
    : 12.92 * val;
};

const OUT_OF_GAMUT_ALPHA = 0.5;
const OUT_OF_GAMUT_COLOR = 0.5 * (1 - OUT_OF_GAMUT_ALPHA);
const MEASURE_RENDER_TIME = false;

export const CurveBackdropLch = (props: {
  lchValues: number[][],
  gamut: "srgb" | "display-p3",
  yRange?: [number, number],
  yAxis: "l" | "c" | "h",
  xStep?: number,
  yStep?: number,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));
  const xStep = props.xStep ?? 1;
  const yStep = props.yStep ?? 1;
  let yRange = props.yRange;
  if (!yRange) {
    if (props.yAxis === "l") {
      yRange = [0, 1];
    } else if (props.yAxis === "c") {
      yRange = [0, 1];
    } else {
      yRange = [0, 360];
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    canvas.width = Math.floor(props.lchValues.length / xStep);
    canvas.height = Math.floor(256 / yStep);
    const ctx = canvas.getContext("2d", { colorSpace: props.gamut });
    if (!ctx) {
      return;
    }
    const imageData = ctx.createImageData(canvas.width, canvas.height, { colorSpace: props.gamut });
    const data = imageData.data;
    const now = performance.now();
    for (let x = 0; x < canvas.width; x++) {
      for (let y = 0; y < canvas.height; y++) {
        const index = (x + y * canvas.width) * 4;
        const _x = x * xStep;
        const _y = y * yStep;
        let [l, c, h] = props.lchValues[_x];
        const yValue = _y / 256 * (yRange[0] - yRange[1]) + yRange[1];
        if (props.yAxis === "l") {
          l = yValue;
        } else if (props.yAxis === "c") {
          c = yValue;
        } else {
          h = yValue;
        }
        const [lr, lg, lb, isInGamut] = lchToLinearRgb(l, c, h, props.gamut);
        if (isInGamut) {
          data[index] = Math.round(sRGBLinearToGamma(lr) * 255);
          data[index + 1] = Math.round(sRGBLinearToGamma(lg) * 255);
          data[index + 2] = Math.round(sRGBLinearToGamma(lb) * 255);
          data[index + 3] = 255;
        }
        else {
          data[index] = Math.round(sRGBLinearToGamma(lr * OUT_OF_GAMUT_ALPHA + OUT_OF_GAMUT_COLOR) * 255);
          data[index + 1] = Math.round(sRGBLinearToGamma(lg * OUT_OF_GAMUT_ALPHA + OUT_OF_GAMUT_COLOR) * 255);
          data[index + 2] = Math.round(sRGBLinearToGamma(lb * OUT_OF_GAMUT_ALPHA + OUT_OF_GAMUT_COLOR) * 255);
          data[index + 3] = 63;
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);
    const elapsed = performance.now() - now;
    if (MEASURE_RENDER_TIME) {
      console.log(`BackdropLch render time: ${elapsed}ms`);
    }
  }, [props.yAxis, xStep, yRange, yStep, props.lchValues, props.gamut]);

  return <canvas
    ref={canvasRef}
    style={{
      width: "100%",
      height: "100%",
    }}
  />;
}