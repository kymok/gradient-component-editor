import { useAtomValue } from "jotai";
import { activeParamIdAtom, getReferenceColorsAtom } from "../../../store";
import { ReferenceLocationOverlay as Viewer } from "./curve-viewer";
import { Rect } from "../../marker-editor/utils/canvas";

type yAxis = 'l' | 'c' | 'h';

export const CurveReferenceLocationOverlay = (props: { yAxis: yAxis, rect: Rect }) => {
  const activeParamId = useAtomValue(activeParamIdAtom);
  const references = useAtomValue(getReferenceColorsAtom(activeParamId));
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Viewer
        references={references}
        rect={props.rect}
        yAxis={props.yAxis}
      />
    </div>
  );
}