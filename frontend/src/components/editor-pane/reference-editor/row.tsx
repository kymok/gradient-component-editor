import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ColorWell } from "../../inputs/color-well";
import { IconButton } from "../../inputs/button";
import { ChevronsUpDown, XIcon } from "lucide-react";
import { Select } from "../../inputs/select";
import { TableCellContainer, TableIcon } from "../../inputs/table";
import { Input } from "../../inputs/input";
import { Match, Reference } from "../../../store/types";

type ReferenceTableRowProps = {
  id: string;
  index: number;
  reference: Reference;
  match: Match;
  onMethodChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onDelete: () => void;
}

export const ReferenceTableRow = ({
  id,
  index,
  reference,
  match,
  onColorChange,
  onMethodChange,
  onDelete,
}: ReferenceTableRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style}>
      <td>{index + 1}</td>
      <td>
        <TableCellContainer>
          <div>
            <ColorWell
              color={`oklab(${reference.oklabColor[0]} ${reference.oklabColor[1]} ${reference.oklabColor[2]})`}
            />
          </div>
          <Input value={reference.color} onChange={(e) => onColorChange(e.target.value)} />
        </TableCellContainer>
      </td>
      <td>
        <Select
          items={[
            { value: "color", label: "ΔE" },
            { value: "lightness", label: "ΔL" },
          ]}
          defaultValue={reference.matchingMethod}
          onValueChange={onMethodChange}
        />
      </td>
      <td>
        <TableCellContainer>
          <div style={{
            display: "flex",
            flexDirection: "row",
            gap: "0",
          }}>
            <ColorWell
              color={`oklab(${reference.oklabColor[0]} ${reference.oklabColor[1]} ${reference.oklabColor[2]})`}
            />
            <ColorWell
              color={`oklab(${match.color[0]} ${match.color[1]} ${match.color[2]})`}
            />
          </div>
        </TableCellContainer>
      </td>
      <td>
        <span className="text-text-secondary italic">
          {match.matchingError.deltaL.toFixed(2)}
        </span>
      </td>
      <td>
        <span className="text-text-secondary italic">
          {match.matchingError.deltaC.toFixed(2)}
        </span>
      </td>
      <td>
        <span className="text-text-secondary italic">
          {Number.isNaN(match.matchingError.deltaHdeg) ? '-' : match.matchingError.deltaHdeg.toFixed(1)}
        </span>
      </td>
      <td>
        <TableCellContainer align="end">
          <IconButton
            icon={<XIcon />}
            label="Delete"
            variant="danger"
            onClick={onDelete}
          />
        </TableCellContainer>
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
