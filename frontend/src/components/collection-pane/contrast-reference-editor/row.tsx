import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconButton } from "../../inputs/button";
import { ChevronsUpDown, XIcon } from "lucide-react";
import { TableCellContainer, TableIcon } from "../../inputs/table";
import { Input } from "../../inputs/input";
import { ColorWell } from "../../inputs/color-well";

type ReferenceTableRowProps = {
  id: string;
  index: number;
  color: string;
  name: string;
  onColorChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onDelete: () => void;
}

export const ReferenceTableRow = ({
  id,
  index,
  color,
  name,
  onColorChange,
  onNameChange,
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
          <ColorWell color={color} />
          <Input value={color} onChange={(e) => onColorChange(e.target.value)} />
        </TableCellContainer>
      </td>
      <td>
        <TableCellContainer>
          <Input value={name} onChange={(e) => onNameChange(e.target.value)} />
        </TableCellContainer>
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
