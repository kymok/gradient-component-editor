import { CurveControlPoint } from "../../../utils/curve";
import { deletePoints } from "../../../utils/curve";
import { clamp } from "../../marker-editor/utils/math";
import { Rect } from "../../marker-editor/utils/canvas";
import { BrushCleaning, XIcon } from "lucide-react";
import { IconButton } from "../../inputs/button";
import { Toolbar as ToolbarContainer } from "../../inputs/toolbar";
import { ParamInput } from "../../inputs/input";

const PRECISION = 3;

export const Toolbar = ({
  controlPoints,
  setControlPoints,
  selectedPointIds,
  setSelectedPointIds = () => { },
  controlPointBound,
  onClear,
}: {
  controlPoints: CurveControlPoint[],
  setControlPoints: React.Dispatch<React.SetStateAction<CurveControlPoint[]>>,
  selectedPointIds: string[],
  setSelectedPointIds?: React.Dispatch<React.SetStateAction<string[]>>,
  controlPointBound: Rect,
  onClear?: () => void,
}) => {
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
  const p = selectedPointIds.length === 1 ? controlPoints.find((p) => p.id === selectedPointIds[0]) : null;
  const x = p !== null ? Math.round((p?.x ?? 0) * 10 ** PRECISION) / 10 ** PRECISION : null;
  const y = p !== null ? Math.round((p?.y ?? 0) * 10 ** PRECISION) / 10 ** PRECISION : null;
  const handleXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (x === null) {
      return;
    }
    const newX = parseFloat(e.target.value);
    if (isNaN(newX)) {
      return;
    }
    const newPoint = {
      ...controlPoints.find((p) => p.id === selectedPointIds[0])!,
      x: clamp(newX, controlPointBound.xmin, controlPointBound.xmax),
    };
    setControlPoints((prev) => prev.map((p) => p.id === newPoint.id ? newPoint : p));
  };
  const handleYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (y === null) {
      return;
    }
    const newY = parseFloat(e.target.value);
    if (isNaN(newY)) {
      return;
    }
    const newPoint = {
      ...controlPoints.find((p) => p.id === selectedPointIds[0])!,
      y: clamp(newY, controlPointBound.ymin, controlPointBound.ymax),
    };
    setControlPoints((prev) => prev.map((p) => p.id === newPoint.id ? newPoint : p));
  };

  return (
    <ToolbarContainer>

      <IconButton
        type="button"
        onClick={onClear}
        disabled={!onClear}
        icon={<BrushCleaning />}
        label="Clear"
        variant="danger"
      />
      <div style={{ width: "100%" }} />
      <IconButton
        type="button"
        onClick={() => canDeleteSelected && handleDelete()}
        value="Delete"
        disabled={!canDeleteSelected}
        icon={<XIcon />}
        label="Delete"
        variant="danger"
      />
      <ParamInput
        name="x"
        type="number"
        placeholder=""
        step={0.01}
        value={x ?? ""}
        onChange={handleXChange}
        disabled={x === null}
        label="X"
      />
      <ParamInput
        name="y"
        type="number"
        placeholder=""
        step={0.01}
        value={y ?? ""}
        onChange={handleYChange}
        disabled={y === null}
        label="Y"
      />
    </ToolbarContainer>
  );
}