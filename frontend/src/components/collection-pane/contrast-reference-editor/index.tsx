import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ReferenceTableRow } from "./row";
import { useAtomValue, useSetAtom } from "jotai";
import { contrastGridReferenceColorsAtom } from "../../../store";
import { Table } from "../../inputs/table";
import { Toolbar } from "../../inputs";
import { BrushCleaning, ListPlus, Plus } from "lucide-react";
import { IconButton } from "../../inputs/button";
import { AddColorsDialog } from "./add-colors";
import { useState } from "react";
import { AccordionSection } from "../../layout";

export const ContrastReferences = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const references = useAtomValue(contrastGridReferenceColorsAtom);
  const setReferences = useSetAtom(contrastGridReferenceColorsAtom);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  const handleClearReferences = () => {
    setReferences([]);
  };

  const handleAddColor = () => {
    const newReference = {
      color: 'rgb(240, 240, 240)',
      name: 'New Color',
    };
    setReferences([...references, newReference]);
  }

  const handleAddColorsFromCssCodeBlock = () => {
    setDialogOpen(true);
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = references.findIndex(ref => `reference-${ref.name}` === active.id);
      const newIndex = references.findIndex(ref => `reference-${ref.name}` === over.id);
      const newReferences = [...references];
      const [removed] = newReferences.splice(oldIndex, 1);
      newReferences.splice(newIndex, 0, removed);
      setReferences(newReferences);
    }
  };

  return (
    <AccordionSection title="Contrast References" defaultOpen={false}>
      <div className="flex flex-col gap-1 w-[512px]">
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
        >
          <Table>
            <thead>
              <tr>
                <th />
                <th>Color</th>
                <th>Name</th>
                <th />
                <th />
              </tr>
            </thead>
            <tbody>
              <SortableContext
                items={references.map(ref => `reference-${ref.name}`)}
                strategy={verticalListSortingStrategy}
              >
                {references?.map((ref, index) => (
                  <ReferenceTableRow
                    key={`reference-${ref.name}`}
                    id={`reference-${ref.name}`}
                    index={index}
                    color={ref.color}
                    name={ref.name}
                    onColorChange={(color: string) => {
                      const newReferences = [...references];
                      newReferences[index] = {
                        ...ref,
                        color,
                      }
                      setReferences(newReferences);
                    }}
                    onNameChange={(name: string) => {
                      const newReferences = [...references];
                      newReferences[index] = {
                        ...ref,
                        name,
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
