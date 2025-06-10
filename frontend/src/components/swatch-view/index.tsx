import toast from "react-hot-toast";
import { useAtomValue } from "jotai";
import { activeParamIdAtom, gamutAtom, getGradientSwatchesAtom } from "../../store";

export const SwatchView = (props: {
  id?: string;
}) => {
  const idAtomValue = useAtomValue(activeParamIdAtom)
  const id = props.id ?? idAtomValue;
  const gamut = useAtomValue(gamutAtom);
  const evaluationResults = useAtomValue(getGradientSwatchesAtom(id));
  return (
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    }}>
      <div style={{
        display: 'flex',
        width: "100%",
        height: "100%",
        flexDirection: 'row',
      }}>
        {evaluationResults.map((result, index) => (
          <div
            key={index}
            style={{
              width: '100%',
              height: '64px',
              backgroundColor: result.serializedColor,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              cursor: 'pointer',
            }}
            onClick={() => {
              navigator.clipboard.writeText(result.oklch.cssString);
              toast.success("Copied!");
            }}
          >
            {/* Out of gamut warnings */}
            {gamut === 'display-p3' && !result.p3.isInGamut && <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
            }}>
              ⚠️
            </div>}
            {gamut === 'srgb' && !result.srgb.isInGamut && <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
            }}>
              ⚠️
            </div>}
            <div style={{
              color: 'white',
              fontSize: '12px',
            }}>
              A
            </div>
            <div style={{
              color: 'black',
              fontSize: '12px',
            }}>
              A
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}