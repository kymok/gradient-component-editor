import toast from "react-hot-toast";
import { useAtom, useAtomValue } from "jotai";
import { activeParamIdAtom, gamutAtom, getGradientSwatchesAtom, paramAtomFamily } from "../../store";
import { Toolbar } from "../inputs/toolbar";
import { Input } from "../inputs/input";

export const SwatchView = (props: {
  id?: string;
  shouldShowToolbar?: boolean;
}) => {
  const idAtomValue = useAtomValue(activeParamIdAtom)
  const id = props.id ?? idAtomValue;
  const gamut = useAtomValue(gamutAtom);
  const evaluationResults = useAtomValue(getGradientSwatchesAtom(id));
  const [param, setparam] = useAtom(paramAtomFamily(id));
  const handleNameChange = (name: string) => {
    if (!param) return;
    setparam({
      ...param,
      name: name,
    });
  };

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <div className="flex flex-row w-full h-full">
        {evaluationResults.swatches.map((swatch, index) => (
          <div
            key={index}
            className="relative flex justify-center items-center w-full h-16 cursor-pointer"
            style={{ backgroundColor: swatch.serializedColor }}
            onClick={() => {
              navigator.clipboard.writeText(swatch.oklch.cssString);
              toast.success("Copied!");
            }}
          >
            {/* Out of gamut warnings */}
            {gamut === 'display-p3' && !swatch.p3.isInGamut && (
              <div className="top-0 right-0 absolute">
                ⚠️
              </div>
            )}
            {gamut === 'srgb' && !swatch.srgb.isInGamut && (
              <div className="top-0 right-0 absolute">
                ⚠️
              </div>
            )}
            <div className="text-white text-xs">
              A
            </div>
            <div className="text-black text-xs">
              A
            </div>
          </div>
        ))}
      </div>
      {props.shouldShowToolbar && (
        <Toolbar>
          <div className="flex items-center w-64">
            <Input
              type="text"
              placeholder="Name"
              value={param?.name || ''}
              onChange={(e) => {
                handleNameChange(e.target.value);
              }}
            />
          </div>
          <div style={{ flexGrow: 1 }}></div>
        </Toolbar>
      )}
    </div>
  )
}