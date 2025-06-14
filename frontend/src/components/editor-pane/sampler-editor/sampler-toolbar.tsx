
import { deletePoints, LinearControlPoint, SamplerData } from "../../../utils/linear";
import { ArrowUpRightFromSquare, SlidersHorizontal, XIcon, ChevronDown, ChevronUp } from "lucide-react";
import { DropDownMenu } from "../../inputs/drop-down";
import { PresetMenuItem } from "../../inputs/types";
import { IconButton } from "../../inputs/button";
import { Toolbar as ToolbarContainer } from "../../inputs/toolbar";
import { useStore } from "jotai";
import { getActiveApproximateGradient } from "../../../store/export";
import toast from "react-hot-toast";


export const SamplerToolbar = ({
  controlPoints,
  setControlPoints,
  selectedPointIds,
  setSelectedPointIds = () => { },
  presets = [],
  showDetails = false,
  onToggleDetails,
}: {
  controlPoints: LinearControlPoint<SamplerData>[],
  setControlPoints: React.Dispatch<React.SetStateAction<LinearControlPoint<SamplerData>[]>>
  selectedPointIds: string[],
  setSelectedPointIds?: React.Dispatch<React.SetStateAction<string[]>>,
  onClear?: () => void,
  presets?: PresetMenuItem[]
  showDetails?: boolean,
  onToggleDetails?: () => void,
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

  return (
    <ToolbarContainer>
      <DropDownMenu
        icon={<SlidersHorizontal />}
        label="Presets..."
        actions={[{ items: presets }]}
        disabled={presets.length === 0}
      />
      <DropDownMenu
        icon={<ArrowUpRightFromSquare />}
        label="Export..."
        actions={[
          {
            items: [
              {
                name: "Copy OKLab Gradient to Clipboard",
                action: handleGetApproximatedGradient,
              },
            ]
          }
        ]}
      />
      <IconButton
        type="button"
        onClick={onToggleDetails}
        icon={showDetails ? <ChevronUp /> : <ChevronDown />}
        label="Show Details"
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
    </ToolbarContainer>
  );
}