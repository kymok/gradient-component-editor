
import { deletePoints, LinearControlPoint } from "../../../utils/linear";
import { clamp } from "../../marker-editor/utils/math";
import { ArrowUpRightFromSquare, SlidersHorizontal, XIcon } from "lucide-react";
import { DropDownMenu } from "../../inputs/drop-down";
import { PresetMenuItem } from "../../inputs/types";
import { IconButton } from "../../inputs/button";
import { Toolbar as ToolbarContainer } from "../../inputs";
import { ParamInput } from "../../inputs/input";
import { Checkbox } from "../../inputs/checkbox";
import { useStore } from "jotai";
import { getActiveApproximateGradient } from "../../../store/export";
import toast from "react-hot-toast";

const PRECISION = 3;

export const SamplerToolbar = <T,>({
  controlPoints,
  setControlPoints,
  selectedPointIds,
  setSelectedPointIds = () => { },
  presets = [],
}: {
  controlPoints: LinearControlPoint<T>[],
  setControlPoints: React.Dispatch<React.SetStateAction<LinearControlPoint<T>[]>>
  selectedPointIds: string[],
  setSelectedPointIds?: React.Dispatch<React.SetStateAction<string[]>>,
  onClear?: () => void,
  presets?: PresetMenuItem[]
}) => {
  const store = useStore();
  const handleGetApproximatedGradient = () => {
    const approximateedGradient = getActiveApproximateGradient(store.get);
    if (!approximateedGradient) {
      console.error("No active parameter found for export.");
      return;
    }
    navigator.clipboard.writeText(approximateedGradient)
      .then(() => {
        console.log("Gradient copied to clipboard successfully.");
        toast.success("Copied!")
      })
      .catch((error) => {
        console.error("Failed to copy gradient to clipboard:", error);
      });
  };
    
  // delete
  const handleDelete = () => {
    if (!selectedPointIds) {
      return;
    }
    const newPoints = deletePoints(controlPoints, selectedPointIds);
    setControlPoints(newPoints);
    setSelectedPointIds([]);
  };
  const canDeleteSelected = selectedPointIds && selectedPointIds.length > 0 && controlPoints.length > 0;

  // number input
  const p = selectedPointIds.length === 1 ? controlPoints.find((p) => p.id === selectedPointIds[0]) ?? null : null;
  const t = p !== null ? Math.round((p?.t ?? 0) * 10 ** PRECISION) / 10 ** PRECISION : null;
  const handleTChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (t === null) {
      return;
    }
    const newT = parseFloat(e.target.value);
    if (isNaN(newT)) {
      return;
    }
    const newPoint = {
      ...controlPoints.find((p) => p.id === selectedPointIds[0])!,
      t: clamp(newT, 0, 1),
      isSmooth: true,
    };
    setControlPoints((prev) => prev.map((p) => p.id === newPoint.id ? newPoint : p));
  };

  // bulk controlled/uncontrolled change
  let state: "checked" | "unchecked" | "indeterminate" = "indeterminate";
  if (selectedPointIds.every((id) => controlPoints.find((p) => p.id === id)?.isSmooth)) {
    state = "checked";
  } else if (selectedPointIds.every((id) => !controlPoints.find((p) => p.id === id)?.isSmooth)) {
    state = "unchecked";
  } else {
    state = "indeterminate";
  }

  const handleSmoothChange = (isSmooth: boolean) => {
    const newPoints = controlPoints.map((point) => {
      if (selectedPointIds.includes(point.id)) {
        return {
          ...point,
          isSmooth: isSmooth,
        };
      }
      return point;
    });
    setControlPoints(newPoints);
  };

  return (
    <ToolbarContainer>
      <DropDownMenu
        icon={<SlidersHorizontal />}
        label="Presets..."
        actions={presets}
        disabled={presets.length === 0}
      />
      <DropDownMenu
        icon={<ArrowUpRightFromSquare />}
        label="Export..."
        actions={[
          {
            name: "Copy OKLab Gradient to Clipboard",
            action: handleGetApproximatedGradient,
          },
        ]}
      />
      <div style={{ flexGrow: 1 }}></div>
      <IconButton
        type="button"
        onClick={() => canDeleteSelected && handleDelete()}
        disabled={!canDeleteSelected}
        icon={<XIcon />}
        label="Delete"
        variant="danger"
      />
      <Checkbox
        label="Smooth"
        checked={state === "checked"}
        onCheckedChange={(e) => handleSmoothChange(e === true)}
        disabled={selectedPointIds.length === 0}
      />
      <ParamInput
        label="X"
        type="number"
        step={0.01}
        placeholder=""
        name="t"
        value={t ?? ""}
        onChange={handleTChange}
        disabled={t === null || p?.isSmooth}
      />
    </ToolbarContainer>
  );
}