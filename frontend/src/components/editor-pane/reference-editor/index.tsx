import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ReferenceTableRow } from "./row";
import { useAtomValue, useSetAtom } from "jotai";
import { activeParamIdAtom, getReferenceColorsAtom, setReferenceColorsAtom } from "../../../store";
import { MatchingMethod, ReferenceInternal } from "../../../store/types";
import { Table } from "../../inputs/table";
import { Toolbar } from "../../inputs/toolbar";
import { BrushCleaning, ListPlus, Plus } from "lucide-react";
import { IconButton } from "../../inputs/button";
import { v4 as uuidv4 } from "uuid";
import { AddColorsDialog } from "./add-colors";
import { useState } from "react";
import { AccordionSection } from "../../layout";

export const References = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const activeParamId = useAtomValue(activeParamIdAtom);
  const references = useAtomValue(getReferenceColorsAtom(activeParamId));
  const setReferences = useSetAtom(setReferenceColorsAtom(activeParamId));

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  const handleClearReferences = () => {
    setReferences([]);
  };

  const handleAddColor = () => {
    const newReference: ReferenceInternal = {
      id: uuidv4(),
      color: 'rgb(240 240 240)', // Default color, can be changed later
      matchingMethod: 'lightness',
    };
    setReferences([...references, newReference]);
  }

  const handleAddColorsFromCssCodeBlock = () => {
    setDialogOpen(true);
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = references.findIndex(ref => `reference-${ref.id}` === active.id);
      const newIndex = references.findIndex(ref => `reference-${ref.id}` === over.id);
      const newReferences = [...references];
      const [removed] = newReferences.splice(oldIndex, 1);
      newReferences.splice(newIndex, 0, removed);
      setReferences(newReferences);
    }
  };

  return (
    <AccordionSection title="References" defaultOpen={false}>
      <div className="flex flex-col gap-1 w-full">
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
        >
          <Table>
            <thead>
              <tr>
                <th />
                <th>Reference Color</th>
                <th>Matching</th>
                <th />
                <th>ΔL</th>
                <th>ΔC</th>
                <th>ΔH°</th>
                <th />
                <th />
              </tr>
            </thead>
            <tbody>
              <SortableContext
                items={references.map(ref => `reference-${ref.id}`)}
                strategy={verticalListSortingStrategy}
              >
                {references?.map((ref, index) => (
                  <ReferenceTableRow
                    key={`reference-${ref.id}`}
                    id={`reference-${ref.id}`}
                    index={index}
                    reference={ref}
                    match={ref.match}
                    onMethodChange={(value: string) => {
                      const newReferences = [...references];
                      newReferences[index] = {
                        ...ref,
                        matchingMethod: value as MatchingMethod,
                      }
                      setReferences(newReferences);
                    }}
                    onColorChange={(color: string) => {
                      const newReferences = [...references];
                      newReferences[index] = {
                        ...ref,
                        color,
                      }
                      setReferences(newReferences);
                    }}
                    onDelete={() => {
                      const newReferences = [...references];
                      newReferences.splice(index, 1);
                      setReferences(newReferences);
                    }}
                  />
                ))}
              </SortableContext>
            </tbody>
          </Table>
        </DndContext>
        <Toolbar>
          <IconButton
            icon={<BrushCleaning />}
            label="Clear"
            variant="danger"
            onClick={handleClearReferences}
            disabled={references.length === 0}
          />
          <div className="flex-grow" />

          <IconButton
            onClick={handleAddColorsFromCssCodeBlock}
            icon={<ListPlus />}
            label="Add Colors"
          />
          <IconButton
            onClick={handleAddColor}
            icon={<Plus />}
            label="Add a Color"
          />
        </Toolbar>
        <AddColorsDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </div>
    </AccordionSection>
  );
};
