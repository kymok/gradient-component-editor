import { useAtom, useAtomValue } from "jotai";
import { CurveEditor } from "./curve-editor";
import { chromaPointsAtom, evaluationLocationsAtom, huePointsAtom, lightnessPointsAtom, activeParamIdAtom, gamutAtom, getGradientLchArrayAtom } from "../../store";
import { CurveBackdropLch } from "../backdrop/curve-backdrop"
import { useState } from "react";
import { Rect } from "../marker-editor/utils/canvas";
import { Sampler } from "./sampler-editor";
import { CurveReferenceLocationOverlay } from "./reference-location-overlay/curve";
import { References } from "./reference-editor";
import { AccordionSection, PaneHeader } from "../layout";

export const EditorPane = () => {
  return (
    <div className="flex flex-col gap-6 w-[512px] shrink-0">
      <PaneHeader>
        Editor
      </PaneHeader>
      <Sampler />
      <References />
      <Lightness />
      <Chroma />
      <Hue />
    </div>
  );
}

const CurveEditorHelpContent = () => {
  return (
    <div className="flex flex-col gap-2 max-w-sm text-sm">
      <p>
        Curve editors allow you to adjust each component of the gradient.
      </p>
      <p>
        Click between control points to add a new point, or drag points to reposition them. Double-click to toggle between anchor and smooth points. Use the "Clear" button to remove all control points.
      </p>
    </div>
  );
}

const Lightness = () => {
  const activeParamId = useAtomValue(activeParamIdAtom);
  const [lightnessPoints, setLightnessPoints] = useAtom(lightnessPointsAtom(activeParamId));
  const backdropLchValues = useAtomValue(getGradientLchArrayAtom(activeParamId));
  const gamut = useAtomValue(gamutAtom);
  const evaluationLocations = useAtomValue(evaluationLocationsAtom(activeParamId)).map((p) => p.t);

  const defaultRect: Rect = {
    xmin: 0,
    ymin: 0,
    xmax: 1,
    ymax: 1,
  };
  const [rect, setRect] = useState<Rect>(defaultRect);
  return (
    <AccordionSection title="Lightness" defaultOpen={true} helpContent={<CurveEditorHelpContent />}>
      <CurveEditor
        controlPoints={lightnessPoints}
        setControlPoints={setLightnessPoints}
        defaultModelRect={defaultRect}
        onRectChange={setRect}
        height={128}
        controlPointBound={{
          xmin: 0,
          ymin: 0,
          xmax: 1,
          ymax: 1,
        }}
        evaluationLocations={evaluationLocations}
        onClear={() => {
          setLightnessPoints(lightnessPoints.filter((p) => p.isExternal));
        }}
      >
        <div style={{
          width: '100%',
          height: '100%',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}>
            <CurveBackdropLch
              lchValues={backdropLchValues}
              yRange={[rect.ymin, rect.ymax]}
              yAxis={'l'}
              gamut={gamut}
            />
          </div>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}>
            <CurveReferenceLocationOverlay
              yAxis={'l'}
              rect={rect}
            />
          </div>
        </div>
      </CurveEditor>
    </AccordionSection>
  )
}

const Chroma = () => {
  const activeParamId = useAtomValue(activeParamIdAtom);
  const [chromaPoints, setChromaPoints] = useAtom(chromaPointsAtom(activeParamId));
  const backdropLchValues = useAtomValue(getGradientLchArrayAtom(activeParamId));
  const gamut = useAtomValue(gamutAtom);
  const evaluationLocations = useAtomValue(evaluationLocationsAtom(activeParamId)).map((p) => p.t);

  const defaultRect: Rect = {
    xmin: 0,
    ymin: 0,
    xmax: 1,
    ymax: 0.4,
  };
  const [rect, setRect] = useState<Rect>(defaultRect);
  return (
    <AccordionSection title="Chroma" defaultOpen={true} helpContent={<CurveEditorHelpContent />}>
      <CurveEditor
        controlPoints={chromaPoints}
        setControlPoints={setChromaPoints}
        defaultModelRect={defaultRect}
        onRectChange={setRect}
        height={128}
        controlPointBound={{
          xmin: 0,
          xmax: 1,
          ymin: 0,
          ymax: 1,
        }}
        evaluationLocations={evaluationLocations}
        onClear={() => {
          setChromaPoints(chromaPoints.filter((p) => p.isExternal));
        }}
      >
        <div style={{
          width: '100%',
          height: '100%',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}>
            <CurveBackdropLch
              lchValues={backdropLchValues}
              yRange={[rect.ymin, rect.ymax]}
              yAxis={'c'}
              gamut={gamut}
            />
          </div>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}>
            <CurveReferenceLocationOverlay
              yAxis={'c'}
              rect={rect}
            />
          </div>
        </div>
      </CurveEditor>
    </AccordionSection>
  );
}

const Hue = () => {
  const activeParamId = useAtomValue(activeParamIdAtom);
  const [huePoints, setHuePoints] = useAtom(huePointsAtom(activeParamId));
  const backdropLchValues = useAtomValue(getGradientLchArrayAtom(activeParamId));
  const gamut = useAtomValue(gamutAtom);
  const evaluationLocations = useAtomValue(evaluationLocationsAtom(activeParamId)).map((p) => p.t);

  const defaultRect: Rect = {
    xmin: 0,
    ymin: 0,
    xmax: 1,
    ymax: 360,
  };
  const [rect, setRect] = useState<Rect>(defaultRect);
  return (
    <AccordionSection title="Hue" defaultOpen={true} helpContent={<CurveEditorHelpContent />}>
      <CurveEditor
        controlPoints={huePoints}
        setControlPoints={setHuePoints}
        defaultModelRect={defaultRect}
        onRectChange={setRect}
        height={256}
        controlPointBound={{
          xmin: 0,
          xmax: 1,
          ymin: -Infinity,
          ymax: Infinity,
        }}
        evaluationLocations={evaluationLocations}
        onClear={() => {
          setHuePoints(huePoints.filter((p) => p.isExternal));
        }}
      >
        <div style={{
          width: '100%',
          height: '100%',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}>
            <CurveBackdropLch
              lchValues={backdropLchValues}
              yRange={[rect.ymin, rect.ymax]}
              yAxis={'h'}
              gamut={gamut}
            />
          </div>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}>
            <CurveReferenceLocationOverlay
              yAxis={'h'}
              rect={rect}
            />
          </div>
        </div>
      </CurveEditor>
    </AccordionSection>
  );
}