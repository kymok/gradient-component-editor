import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { LinearControlPoint, SamplerData } from "../../../utils/linear";
import { Table } from "../../inputs/table";
import { SamplerDetailsRow } from "./sampler-details-row";
import { clamp } from "../../marker-editor/utils/math";

export const SamplerDetailsTable = ({
  controlPoints,
  setControlPoints,
}: {
  controlPoints: LinearControlPoint<SamplerData>[],
  setControlPoints: React.Dispatch<React.SetStateAction<LinearControlPoint<SamplerData>[]>>
}) => {
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = controlPoints.findIndex(p => `sampler-${p.id}` === active.id);
      const newIndex = controlPoints.findIndex(p => `sampler-${p.id}` === over.id);
      const newPoints = [...controlPoints];
      const [removed] = newPoints.splice(oldIndex, 1);
      newPoints.splice(newIndex, 0, removed);
      setControlPoints(newPoints);
    }
  };

  const handleNameChange = (id: string, name: string) => {
    const newPoints = controlPoints.map((point) => {
      if (point.id === id) {
        return {
          ...point,
          value: { name },
        };
      }
      return point;
    });
    setControlPoints(newPoints);
  };

  const handleSmoothChange = (id: string, isSmooth: boolean) => {
    const newPoints = controlPoints.map((point) => {
      if (point.id === id) {
        return {
          ...point,
          isSmooth: isSmooth,
        };
      }
      return point;
    });
    setControlPoints(newPoints);
  };

  const handleTChange = (id: string, value: string) => {
    const newT = parseFloat(value);
    if (isNaN(newT)) {
      return;
    }
    const newPoints = controlPoints.map((point) => {
      if (point.id === id) {
        return {
          ...point,
          t: clamp(newT, 0, 1),
          isSmooth: false, // When manually editing X, make it not smooth
        };
      }
      return point;
    });
    setControlPoints(newPoints);
  };

  const handleDelete = (id: string) => {
    const newPoints = controlPoints.filter(p => p.id !== id);
    setControlPoints(newPoints);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <Table>
        <thead>
          <tr>
            <th />
            <th>Name</th>
            <th>Location</th>
            <th>Smooth</th>
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          <SortableContext
            items={controlPoints.map(p => `sampler-${p.id}`)}
            strategy={verticalListSortingStrategy}
          >
            {controlPoints.map((point, index) => (
              <SamplerDetailsRow
                key={`sampler-${point.id}`}
                id={`sampler-${point.id}`}
                index={index}
                point={point}
                onNameChange={(name) => handleNameChange(point.id, name)}
                onSmoothChange={(isSmooth) => handleSmoothChange(point.id, isSmooth)}
                onTChange={(value) => handleTChange(point.id, value)}
                onDelete={() => handleDelete(point.id)}
              />
            ))}
          </SortableContext>
        </tbody>
      </Table>
    </DndContext>
  );
};