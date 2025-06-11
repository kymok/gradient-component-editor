import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { activeParamIdAtom, getAllGradientSwatchesAtom, getGradientSwatchesAtom, paramAtomFamily, paramIdsAtom, setParamAtom } from '../../../store';
import { SwatchView } from '../../swatch-view';
import { Toolbar } from '../../inputs/toolbar';
import { IconButton } from '../../inputs/button';
import { ArrowUpRightFromSquare, ChevronsUpDown, Plus, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { RadioButton } from '../../inputs/radio';
import { DropDownMenu } from '../../inputs/drop-down';
import toast from 'react-hot-toast';
import { Section } from '../../layout';

const SortableItem = ({ id }: { id: string }) => {
  const [activeParamId, setActiveParamId] = useAtom(activeParamIdAtom);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: 'max-content',
      }}
    >
      <div style={{
        width: '24px',
        height: '100%',
        marginLeft: '-24px',
        paddingRight: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'start',
      }}>
        <RadioButton
          checked={activeParamId === id}
          onChange={(e) => {
            e.stopPropagation();
            setActiveParamId(id);
          }}
        />
      </div>
      <div style={{
        width: '512px',
        flexShrink: 0,
      }}>
        <SwatchView id={id} />
      </div>
      <div {...attributes} {...listeners} style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'grab',
        width: '24px',
        height: '24px',
      }}>
        <ChevronsUpDown width={16} height={16} style={{ color: 'var(--color-text-primary)' }} />
      </div>
    </div>
  );
};

export const Collection = () => {
  const [paramIds, setParamIds] = useAtom(paramIdsAtom);
  const [activeParamId, setActiveParamId] = useAtom(activeParamIdAtom);
  const param = useAtomValue(paramAtomFamily(activeParamId));
  const setNewParam = useSetAtom(setParamAtom);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddGradient = () => {
    const newId = uuidv4();
    setParamIds((ids) => [...ids, newId]);
    setActiveParamId(newId);
    setNewParam({
      ...param,
      id: newId,
    })
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setParamIds((items) => {
        const oldIndex = items.indexOf(active.id.toString());
        const newIndex = items.indexOf(over.id.toString());
        if (oldIndex !== -1 && newIndex !== -1) {
          return arrayMove(items, oldIndex, newIndex);
        }
        return items;
      });
    }
  };

  const handleDelete = () => {
    const newIds = paramIds.filter((id) => id !== activeParamId);
    setParamIds(newIds);
    setActiveParamId(newIds[0]);
  };

  const canDelete = paramIds.length > 1;

  return (
    <Section title="Swatches">
      <div className={"flex flex-col gap-2"}>
        <div className={"flex flex-col"}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={paramIds}
              strategy={verticalListSortingStrategy}
            >
              {paramIds.map((id) => (
                <SortableItem key={id} id={id} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
        <div style={{ width: '512px' }} >
          <Toolbar>
            <ExportColorDropDown id={activeParamId} />
            <ExportAllDropDown />
            <div style={{ flexGrow: 1 }} />
            <IconButton
              icon={<X />}
              label="Delete"
              variant='danger'
              onClick={handleDelete}
              disabled={!canDelete}
            />
            <IconButton
              icon={<Plus />}
              label="Add"
              onClick={handleAddGradient}
            />
          </Toolbar>
        </div>
      </div>
    </Section>
  );
}

const ExportAllDropDown = () => {
  const swatchess = useAtomValue(getAllGradientSwatchesAtom);
  return (
    <DropDownMenu
      icon={<ArrowUpRightFromSquare />}
      label="Export All..."
      actions={[
        {
          name: "Copy OKLCH to Clipboard",
          action: () => {
            const colors = swatchess.map(
              (swatches) => swatches.map(s => s.oklch.cssString).join('\n')
            ).join('\n\n');
            navigator.clipboard.writeText(colors);
            toast.success("Copied!");
          },
        },
        {
          name: "Copy Display P3 to Clipboard",
          action: () => {
            const colors = swatchess.map(
              (swatches) => swatches.map(s => s.p3.cssString).join('\n')
            ).join('\n\n');
            navigator.clipboard.writeText(colors);
            toast.success("Copied!");
          },
        },
        {
          name: "Copy sRGB to Clipboard",
          action: () => {
            const colors = swatchess.map(
              (swatches) => swatches.map(s => s.srgb.cssString).join('\n')
            ).join('\n\n');
            navigator.clipboard.writeText(colors);
            toast.success("Copied!");
          },
        },
        {
          name: "Copy Hex to Clipboard",
          action: () => {
            const colors = swatchess.map(
              (swatches) => swatches.map(s => s.srgb.hexString).join('\n')
            ).join('\n\n');
            navigator.clipboard.writeText(colors);
            toast.success("Copied!");
          },
        },
      ]}
    />
  )
}

const ExportColorDropDown = (props: { id: string }) => {
  const evaluationResults = useAtomValue(getGradientSwatchesAtom(props.id));
  return (
    <DropDownMenu
      icon={<ArrowUpRightFromSquare />}
      label="Export..."
      actions={[
        {
          name: "Copy OKLCH to Clipboard",
          action: () => {
            const colors = evaluationResults.map(
              (result) => result.oklch.cssString
            ).join('\n');
            navigator.clipboard.writeText(colors);
            toast.success("Copied!");
          },
        },
        {
          name: "Copy Display P3 to Clipboard",
          action: () => {
            const colors = evaluationResults.map(
              (result) => result.p3.cssString
            ).join('\n');
            navigator.clipboard.writeText(colors);
            toast.success("Copied!");
          },
        },
        {
          name: "Copy sRGB to Clipboard",
          action: () => {
            const colors = evaluationResults.map(
              (result) => result.srgb.cssString
            ).join('\n');
            navigator.clipboard.writeText(colors);
            toast.success("Copied!");
          },
        },
        {
          name: "Copy Hex to Clipboard",
          action: () => {
            const colors = evaluationResults.map(
              (result) => result.srgb.hexString
            ).join('\n');
            navigator.clipboard.writeText(colors);
            toast.success("Copied!");
          },
        },
      ]}
    />
  )
}
