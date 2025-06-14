import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronsUpDown, X } from "lucide-react";
import { LinearControlPoint, SamplerData } from "../../../utils/linear";
import { IconButton } from "../../inputs/button";
import { Checkbox } from "../../inputs/checkbox";
import { Input, ParamInput } from "../../inputs/input";
import { TableCellContainer, TableIcon } from "../../inputs/table";

const PRECISION = 3;

export const SamplerDetailsRow = ({
  id,
  index,
  point,
  onNameChange,
  onSmoothChange,
  onTChange,
  onDelete,
}: {
  id: string,
  index: number,
  point: LinearControlPoint<SamplerData>,
  onNameChange: (name: string) => void,
  onSmoothChange: (isSmooth: boolean) => void,
  onTChange: (value: string) => void,
  onDelete: () => void,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const t = Math.round(point.t * 10 ** PRECISION) / 10 ** PRECISION;

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="group"
    >
      <td>
        {index + 1}
      </td>
      <td>
        <Input
          type="text"
          placeholder={`Point ${index + 1}`}
          value={point.value?.name || ""}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </td>
      <td>
        <ParamInput
          type="number"
          step={0.01}
          value={t}
          onChange={(e) => onTChange(e.target.value)}
          disabled={point.isSmooth}
        />
      </td>
      <td >
        <Checkbox
          checked={point.isSmooth}
          onCheckedChange={(checked) => onSmoothChange(checked === true)}
        />
      </td>
      <td>
        <IconButton
          type="button"
          onClick={onDelete}
          icon={<X size={16} />}
          label="Delete"
          variant="danger"
        />
      </td>
      <td>
        <TableCellContainer align="end">
          <TableIcon {...attributes} {...listeners} style={{ cursor: 'grab' }}>
            <ChevronsUpDown />
          </TableIcon>
        </TableCellContainer>
      </td>
    </tr>
  );
};