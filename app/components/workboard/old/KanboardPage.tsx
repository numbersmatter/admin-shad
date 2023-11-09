import { DragEndEvent } from "@dnd-kit/core";
import { Link, useFetcher, } from "@remix-run/react";
import { useState } from "react";
import type { CardData, ColData, Column } from "~/server/database/store.server";
import { BoardCard } from "../comp/board-card";
import { KanbanContext, SortableColumn } from "../comp/kanban-context";
import { constructColumns } from "../utils";


interface SortableEvent {
  containerId: string;
  index: number;
  items: string[];
}

export default function KanbanBoardPage({
  columns,
  columnOrder,
  columnData,
  cardData,
}: {
  columns: Column[],
  columnOrder: string[],
  columnData: ColData,
  cardData: CardData
}) {

  const [activeId, setActiveId] = useState<string | null>(null);
  const [columns2, setColumns2] = useState<Column[]>(columns);
  const fetcher = useFetcher();
  const isFetching = fetcher.state !== 'idle';


  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;
    console.log("event", event)
    if (!over || !activeId) return;

    const columnZones = columnOrder.map((colId) => `${colId}-zone`);
    const overId = over.id as string;

    if (columnZones.includes(overId)) {
      fetcher.submit({ activeId, overId: over.id, _action: "moveCard" }, { method: 'post' })
      const tempColumns: Column[] = constructTempColumns({ columnOrder, colData: columnData, cardData: cardData, activeId, overId: over.id as string });
      setColumns2(tempColumns);
      return setActiveId(null);
    };

    const { data } = over;
    if (!data) return;
    const sortable = data?.current?.sortable;

    if (!sortable) return;
    const sortEvent = sortable as SortableEvent;

    fetcher.submit({
      activeId,
      containerId: sortEvent.containerId,
      _action: "sortCard",
      index: sortEvent.index,
      srcContainerId: event?.active?.data?.current?.sortable.containerId,
    }, { method: 'post' })






  };



  const allCards = columns
    .map((column) => column.cards)
    .reduce((acc, cards) => acc.concat(cards), []);

  const activeCard = allCards.find((card) => card.id === activeId);
  const activeName = activeCard ? activeCard.name : 'Project';


  const displayColumns = isFetching ? columns2 : columns;


  return (
    <div className="flex  flex-1 flex-col text-slate-400">
      <div className="border-b-8 px-4 ">
        <h1 className="text-4xl font-semibold text-slate-100">
          Kanban Board
        </h1>

      </div>
      <KanbanContext
        activeId={activeId}
        handleDragEnd={handleDragEnd}
        setActiveId={setActiveId}
        name={activeName}
      >
        <div id="board-container" className="flex flex-1 gap-3 h-full px-3 py-3 overflow-scroll bg-slate-700">
          {/* Kanban Columns */}
          {
            displayColumns.map((column) => {
              const items = column.cards.map((card) => card.id);
              return (
                <KanbanColumn id={column.id} name={column.name} key={column.name}>
                  <SortableColumn id={column.id} items={items} >
                    {
                      column.cards.map((card) =>
                        <BoardCard
                          name={card.name}
                          key={card.id}
                          id={card.id}
                          linkTo={card.linkTo}
                        />
                      )
                    }
                  </SortableColumn>
                </KanbanColumn>
              )
            })
          }
        </div>
      </KanbanContext>
    </div>
  );
}

function KanbanColumn({ name, children, id }: { id: string, name: string, children: React.ReactNode }) {

  return (
    <div id={id} className="flex flex-col w-72 text-center  ">
      <h5 className="text-lg text-slate-300 font-bold">
        {name}
      </h5>
      <p className="text-sm text-slate-200">
        {id}
      </p>
      <div className="flex-1 ">
        {children}
      </div>
    </div>
  )
}



function constructTempColumns(
  { columnOrder, colData, cardData, activeId, overId }:
    {
      columnOrder: string[],
      colData: ColData,
      cardData: CardData,
      activeId: string,
      overId: string
    }
) {

  // scenario 1: card is over itself
  const currentState = constructColumns(columnOrder, colData, cardData);
  if (activeId === overId) return currentState;

  // scenario 2: card is over a column id
  if (columnOrder.includes(overId)) {
    const newColData = { ...colData };
    const oldColId = Object.keys(colData).find((colId) => colData[colId].cardIds.includes(activeId));

    if (!oldColId) return currentState;

    const oldCol = newColData[oldColId];
    const newCol = newColData[overId];

    oldCol.cardIds = oldCol.cardIds.filter((id) => id !== activeId);
    newCol.cardIds = [...newCol.cardIds, activeId];

    return constructColumns(columnOrder, newColData, cardData);
  }

  // scenario 3: card is over a  placeholder card
  const placeholderZoneIds = columnOrder.map((colId) => `${colId}-zone`);
  if (placeholderZoneIds.includes(overId)) {
    const overColId = columnOrder.find((colId) => `${colId}-zone` === overId);
    if (!overColId) return currentState;
    const newColData = { ...colData };
    const oldColId = Object.keys(colData)
      .find((colId) => colData[colId].cardIds.includes(activeId));

    if (!oldColId) return currentState;

    const oldCol = newColData[oldColId];
    const newCol = newColData[overColId];

    oldCol.cardIds = oldCol.cardIds.filter((id) => id !== activeId);
    newCol.cardIds = [...newCol.cardIds, activeId];

    return constructColumns(columnOrder, newColData, cardData);
  }

  // scenario 4: card is over a card
  const overColId = Object.keys(colData).find((colId) => colData[colId].cardIds.includes(overId));
  if (!overColId) return currentState;

  const oldColId = Object.keys(colData)
    .find((colId) => colData[colId].cardIds.includes(activeId));

  if (!oldColId) return currentState;

  // scenario 4.1: card is over a card in the same column
  if (oldColId === overColId) {
    const newColData = { ...colData };
    const col = newColData[overColId];
    col.cardIds = col.cardIds.filter((id) => id !== activeId);
    const overIndex = col.cardIds.findIndex((id) => id === overId);
    col.cardIds.splice(overIndex, 0, activeId);

    return constructColumns(columnOrder, newColData, cardData);
  }

  // scenario 4.2: card is over a card in a different column
  if (oldColId !== overColId) {
    const newColData = { ...colData };
    const oldCol = newColData[oldColId];
    const newCol = newColData[overColId];

    oldCol.cardIds = oldCol.cardIds.filter((id) => id !== activeId);
    const overIndex = newCol.cardIds.findIndex((id) => id === overId);
    newCol.cardIds.splice(overIndex, 0, activeId);

    return constructColumns(columnOrder, newColData, cardData);
  }

  return currentState;
}
