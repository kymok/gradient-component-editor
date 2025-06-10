import { useAtomValue } from "jotai";
import { activeParamIdAtom, getReferenceColorsAtom } from "../../../store";
import { ReferenceLocationOverlay as Viewer } from "./sampler-viewer";

export const SamplerReferenceLocationOverlay = () => {
  const activeParamId = useAtomValue(activeParamIdAtom);
  const references = useAtomValue(getReferenceColorsAtom(activeParamId));
  return (
    <div style={{ width: "100%", height: "24px" }}>
      <Viewer references={references} />
    </div>
  );
}