import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, closestCorners, useDroppable, DragOverlay, pointerWithin } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Bars3Icon } from "@heroicons/react/20/solid";


// @ts-ignore
export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function pointThenCornerCollisionDetection(args: any) {
  const pointerCollisions = pointerWithin(args);
  if (pointerCollisions.length > 0) {
    return pointerCollisions;
  }
  return closestCorners(args);
}


export function KanbanContext(
  { children, activeId, setActiveId, name, handleDragEnd }:
    {
      children: React.ReactNode,
      activeId: string | null,
      name: string,
      setActiveId: (id: string | null) => void,
      handleDragEnd: (event: DragEndEvent) => void
    }
) {

  const sensors = useSensors(
    useSensor(PointerSensor,),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );


  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

  };


  return (
    <DndContext
      id="workboard"
      sensors={sensors}
      collisionDetection={pointThenCornerCollisionDetection}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      {children}
      <Placeholder activeId={activeId} name={name} />
    </DndContext>
  )
};

function Placeholder({ activeId, name }: { activeId: string | null, name: string }) {
  return (
    <DragOverlay>
      {activeId ? (
        <div
          className="h-28 w-64 mx-auto  border-2 rounded-md border-slate-400 bg-slate-700 flex-col flex"
        >
          <div className="w-full py-0.5 pl-0.5 bg-slate-950 flex justify-center">
            <Bars3Icon
              className="h-6 w-6 text-slate-400"
            />
          </div>
          <p className="text-lg text-center text-slate-200 pt-0.5 font-semibold">
            {name}
          </p>
          <div className="flex flex-1 flex-col-reverse" >
            {/* <button className="text-slate-200">
              View
            </button> */}
          </div>
        </div>

      )
        : null}
    </DragOverlay>

  )
}

export function SortableColumn(
  { id, children, items }: { id: string, children: React.ReactNode, items: string[] }

) {
  const zoneId = `${id}-zone`;
  return (
    <div
      className="h-full w-full flex flex-col  gap-2 pt-0.5 justify-start rounded-md  border-4 border-slate-400 bg-slate-950"
    >
      <SortableContext
        items={[...items, zoneId]}
        strategy={verticalListSortingStrategy}
        id={id}
      >
        {children}
        <ColumnDropZone id={zoneId} />
      </SortableContext>
    </div>
  )
}

export function Droppable(
  { children, id }: { id: string, children: React.ReactNode }
) {

  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div className={` h-full w-full flex flex-col  gap-2 pt-0.5 justify-start rounded-md  border-4 border-slate-400 bg-slate-300 `} ref={setNodeRef}>

      {children}
    </div>
  )
};

function ColumnDropZone({ id }: { id: string }) {

  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div className={classNames(isOver ? "bg-slate-800" : "", "h-full w-full border-2 border-slate-900")} ref={setNodeRef}>
      <p>
        {id}
      </p>
    </div>
  )
}

