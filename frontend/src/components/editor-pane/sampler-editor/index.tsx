import { LinearGradientBackdrop } from "../../backdrop/linear-gradient-backdrop";
import { samplerLinear5, samplerTailwindish11 } from "../../../store/defaults";
import { useState } from "react";
import { SamplerToolbar } from "./sampler-toolbar";
import { LinearEditor as LinearEditorEditor } from "../../marker-editor/linear-editor";
import { SamplerReferenceLocationOverlay } from "../reference-location-overlay/sampler";
import { useAtom, useAtomValue } from "jotai";
import { activeParamIdAtom, evaluationLocationsAtom, gamutAtom, getGradientLchArrayAtom } from "../../../store";
import { AccordionSection } from "../../layout";
import { SamplerDetailsTable } from "./sampler-details-table";
import { SamplerData, LinearControlPoint } from "../../../utils/linear";
import { IconButton } from "../../inputs/button";
import { Toolbar } from "../../inputs/toolbar";
import { Trash2, Plus } from "lucide-react";

const SAMPLER_HEIGHT = 64;

const SamplerHelpContent = () => {
  return (
    <div className="flex flex-col gap-2 max-w-sm text-sm">
      <p>
        The sampler samples the gradient into swatches at specified locations.
      </p>
      <p>
        Click between markers to add a new marker, or drag markers to reposition them. Doubleclick to toggle between absolute location and interpolated location.
      </p>
    </div>
  );
}

export const Sampler = () => {
  const [selectedPointIds, setSelectedPointIds] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const activeParamId = useAtomValue(activeParamIdAtom);
  const [points, setPoints] = useAtom(evaluationLocationsAtom(activeParamId));
  const backdropLchValues = useAtomValue(getGradientLchArrayAtom(activeParamId));
  const gamut = useAtomValue(gamutAtom);

  return (
    <AccordionSection title="Sampler" defaultOpen={true} helpContent={<SamplerHelpContent />}>
      {/* Sampler Editor */}
      <div className="flex flex-col gap-2 w-full h-full">
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
            <LinearEditorEditor<SamplerData>
              selectedPointIds={selectedPointIds}
              setSelectedPointIds={setSelectedPointIds}
              controlPoints={points}
              setControlPoints={setPoints}
              unsmoothOnDrag={true}
              getValue={(t) => {
                // Generate a default name based on position
                // t is in range [0, 1], so multiply by 1000 for a naming convention similar to Tailwind
                const value = Math.round(t * 1000);
                // Format with leading zeros if needed (e.g., 050, 100, 500)
                const name = value.toString().padStart(3, '0');
                return { name } as SamplerData;
              }}
            />
          </div>
        </div>

        {/* Toolbar */}
        <SamplerToolbar
          controlPoints={points}
          setControlPoints={setPoints}
          selectedPointIds={selectedPointIds}
          setSelectedPointIds={setSelectedPointIds}
          presets={[
            { id: "tailwindish-11", name: "Tailwindish 11", action: () => setPoints(samplerTailwindish11) },
            { id: "linear-5", name: "Linear 5", action: () => setPoints(samplerLinear5) },
          ]}
          showDetails={showDetails}
          onToggleDetails={() => setShowDetails(!showDetails)}
        />

        {/* Details Table */}
        {showDetails && (
          <div className="flex flex-col gap-2 w-full">
            <SamplerDetailsTable
              controlPoints={points}
              setControlPoints={setPoints}
            />
            {/* Details Toolbar */}
            <Toolbar>
              <IconButton
                icon={<Trash2 size={16} />}
                label="Clear"
                variant="danger"
                onClick={() => setPoints([])}
                disabled={points.length === 0}
              />
              <div style={{ flexGrow: 1 }} />
              <IconButton
                icon={<Plus size={16} />}
                label="Add a point"
                onClick={() => {
                  // Find a suitable position for the new point
                  // If no points exist, add at 0.5
                  // Otherwise, find the largest gap between points
                  let newT = 0.5;
                  if (points.length > 0) {
                    const sortedPoints = [...points].sort((a, b) => a.t - b.t);
                    let maxGap = 0;
                    let gapStart = 0;

                    // Check gap at the beginning
                    if (sortedPoints[0].t > maxGap) {
                      maxGap = sortedPoints[0].t;
                      newT = sortedPoints[0].t / 2;
                    }

                    // Check gaps between points
                    for (let i = 0; i < sortedPoints.length - 1; i++) {
                      const gap = sortedPoints[i + 1].t - sortedPoints[i].t;
                      if (gap > maxGap) {
                        maxGap = gap;
                        gapStart = sortedPoints[i].t;
                        newT = gapStart + gap / 2;
                      }
                    }

                    // Check gap at the end
                    const endGap = 1 - sortedPoints[sortedPoints.length - 1].t;
                    if (endGap > maxGap) {
                      newT = sortedPoints[sortedPoints.length - 1].t + endGap / 2;
                    }
                  }

                  // Generate name based on position
                  const value = Math.round(newT * 1000);
                  const name = value.toString().padStart(3, '0');

                  // Create new point
                  const newPoint: LinearControlPoint<SamplerData> = {
                    id: `point-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
                    t: newT,
                    isSmooth: false,
                    value: { name }
                  };

                  setPoints([...points, newPoint].sort((a, b) => a.t - b.t));
                }}
              />
            </Toolbar>
          </div>
        )}
      </div>
    </AccordionSection>
  )
}