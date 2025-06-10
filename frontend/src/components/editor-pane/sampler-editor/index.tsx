import { LinearGradientBackdrop } from "../../backdrop/linear-gradient-backdrop";
import { samplerLinear5, samplerTailwindish11 } from "../../../store/defaults";
import { useState } from "react";
import { SamplerToolbar } from "./sampler-toolbar";
import { LinearEditor as LinearEditorEditor } from "../../marker-editor/linear-editor";
import { SamplerReferenceLocationOverlay } from "../reference-location-overlay/sampler";
import { useAtom, useAtomValue } from "jotai";
import { activeParamIdAtom, evaluationLocationsAtom, gamutAtom, getGradientLchArrayAtom } from "../../../store";
import { AccordionSection } from "../../layout";

const SAMPLER_HEIGHT = 64;

export const Sampler = () => {
  const [selectedPointIds, setSelectedPointIds] = useState<string[]>([]);
  const activeParamId = useAtomValue(activeParamIdAtom);
  const [points, setPoints] = useAtom(evaluationLocationsAtom(activeParamId));
  const backdropLchValues = useAtomValue(getGradientLchArrayAtom(activeParamId));
  const gamut = useAtomValue(gamutAtom);

  return (
    <AccordionSection title="Sampler" defaultOpen={true}>
      <div className="flex flex-col gap-1 w-full h-full">
        {/* Editor */}
        <div className="relative w-full" style={{ height: SAMPLER_HEIGHT }}>
          {/* Backdrop */}
          <div className="top-0 left-0 absolute w-full h-full">
            <LinearGradientBackdrop
              lchValues={backdropLchValues}
              gamut={gamut}
              direction="horizontal"
            />
          </div>

          {/* Reference Locations */}
          <div className="top-0 left-0 absolute w-full h-full">
            <SamplerReferenceLocationOverlay />
          </div>

          {/* Linear Editor */}
          <div className="top-0 left-0 absolute w-full h-full">
            <LinearEditorEditor<null>
              selectedPointIds={selectedPointIds}
              setSelectedPointIds={setSelectedPointIds}
              controlPoints={points}
              setControlPoints={setPoints}
              unsmoothOnDrag={true}
              getValue={() => null}
            />
          </div>
        </div>

        {/* Toolbar */}
        <SamplerToolbar<null>
          controlPoints={points}
          setControlPoints={setPoints}
          selectedPointIds={selectedPointIds}
          setSelectedPointIds={setSelectedPointIds}
          presets={[
            { id: "tailwindish-11", name: "Tailwindish 11", action: () => setPoints(samplerTailwindish11) },
            { id: "linear-5", name: "Linear 5", action: () => setPoints(samplerLinear5) },
          ]}
        />
      </div>
    </AccordionSection>
  )
}