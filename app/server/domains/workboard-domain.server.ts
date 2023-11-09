import { getProjectsByStatus } from "../database/projects.server";
import {
  CardData,
  ColData,
  Column,
  readStore,
  updateStore,
} from "../database/store.server";
import { FieldValue } from "firebase-admin/firestore";

const defaultColData: ColData = {
  BNY2OSSP5nT17LiIK4wg: {
    id: "BNY2OSSP5nT17LiIK4wg",
    name: "Queue",
    cardIds: [],
  },
  pMcnCDgQnizaoFleQ1mx: {
    id: "pMcnCDgQnizaoFleQ1mx",
    name: "Invoiced",
    cardIds: [],
  },
  yJfkvEn190NBw2Dh9Wfa: {
    id: "yJfkvEn190NBw2Dh9Wfa",
    name: "Paid",
    cardIds: [],
  },
  cjZ3mp32ECyTOaYyHG0S: {
    id: "cjZ3mp32ECyTOaYyHG0S",
    name: "WIP",
    cardIds: [],
  },
  yzA4CZasg5HlFgwSQrv: {
    id: "yzA4CZasg5HlFgwSQrv",
    name: "Completed",
    cardIds: [],
  },
};

const defaultColOrder = [
  "BNY2OSSP5nT17LiIK4wg",
  "pMcnCDgQnizaoFleQ1mx",
  "yJfkvEn190NBw2Dh9Wfa",
  "cjZ3mp32ECyTOaYyHG0S",
  "yzA4CZasg5HlFgwSQrv",
];

export const getKanbanData = async ({ storeId }: { storeId: string }) => {
  const storeDoc = await readStore(storeId);
  if (!storeDoc) {
    throw new Error("No store found");
  }

  const { columnData, columnOrder } = storeDoc;

  const colData = columnData;
  const colOrder = columnOrder;

  const activeProjects = await getProjectsByStatus({
    storeId,
    status: "active",
  });
  const validColIds = colOrder.filter((colId) => colData.hasOwnProperty(colId));
  const currentColumns = validColIds.map((colId) => colData[colId]);
  const currentCardIds = currentColumns.map((col) => col.cardIds).flat();

  const activeProjectCards = activeProjects.map((project) => ({
    id: project.id,
    name: project.title,
    linkTo: `/projects/${project.id}`,
  }));

  const cardsNotAssigned = activeProjectCards.filter(
    (card) => !currentCardIds.includes(card.id)
  );

  const unAssignedCardIds = cardsNotAssigned.map((card) => card.id);

  const cardData: CardData = activeProjectCards.reduce((acc, card) => {
    return {
      ...acc,
      [card.id]: card,
    };
  }, {});

  if (cardsNotAssigned.length > 0) {
    await addUnassignedCardsToQueue({
      storeId,
      cardIds: unAssignedCardIds,
    });
  }

  const columns = validColIds.map((colId, index) => {
    const thisCol = colData[colId];
    const validCardIds = thisCol.cardIds.filter((cardId) =>
      cardData.hasOwnProperty(cardId)
    );

    const cards = validCardIds.map((cardId) => cardData[cardId]);

    if (index === 0) {
      return {
        ...thisCol,
        cards: [...cards, ...cardsNotAssigned],
      };
    }

    const column: Column = {
      ...thisCol,
      cards,
    };

    return column;
  });

  return {
    columnData: colData,
    columnOrder: colOrder,
    cardData: cardData,
    columns,
  };
};

export const setDefaultBoardData = async ({ storeId }: { storeId: string }) => {
  const updateData = {
    columnData: defaultColData,
    columnOrder: defaultColOrder,
  };

  await updateStore({
    storeId,
    updateData,
  });

  return { message: "Default board data set" };
};

export const addUnassignedCardsToQueue = async ({
  storeId,
  cardIds,
}: {
  storeId: string;
  cardIds: string[];
}) => {
  const storeDoc = await readStore(storeId);
  if (!storeDoc) {
    throw new Error("No store found");
  }

  const updateData = {
    "columnData.BNY2OSSP5nT17LiIK4wg.cardIds": FieldValue.arrayUnion(
      ...cardIds
    ),
  };

  await updateStore({
    storeId,
    updateData,
  });

  return { message: "Cards added to queue" };
};

export const moveCard = async ({
  storeId,
  cardId,
  overId,
}: {
  storeId: string;
  cardId: string;
  overId: string;
}) => {
  const storeDoc = await readStore(storeId);
  if (!storeDoc) {
    throw new Error("No store found");
  }

  const { columnData, columnOrder } = storeDoc;
  const columnZones = columnOrder.map((colId) => `${colId}-zone`);
  const isOverColumn = columnZones.includes(overId);
  if (!isOverColumn) {
    return { message: "Not over column zone" };
  }

  const overColId = overId.split("-")[0];

  const sourceColId = Object.keys(columnData).find((colId) =>
    columnData[colId].cardIds.includes(cardId)
  );

  if (!sourceColId) {
    return { message: "Card not found" };
  }

  const sameCol = overColId === sourceColId;

  const sourceCol = columnData[sourceColId];
  const sourceCardIndex = sourceCol.cardIds.findIndex((id) => id === cardId);

  if (!sameCol) {
    const updateData = {
      [`columnData.${sourceColId}.cardIds`]: FieldValue.arrayRemove(cardId),
      [`columnData.${overColId}.cardIds`]: FieldValue.arrayUnion(cardId),
    };
    await updateStore({ storeId, updateData });

    return { message: "Card moved is over new column" };
  }

  const newTempCardIds = [...sourceCol.cardIds].filter((id) => id !== cardId);

  const newCardIds = [...newTempCardIds, cardId];
  const updateData = {
    [`columnData.${sourceColId}.cardIds`]: newCardIds,
  };

  await updateStore({ storeId, updateData });

  return { message: "Card moved is over same column" };

  // const overColId = Object.keys(columnData).find((colId) =>
  //   columnData[colId].cardIds.includes(overId)
  // );

  // if (!overColId) {
  //   return { message: "Column not found" };
  // }

  // const overCol = columnData[overColId];

  // if (sourceColId === overColId) {
  //   const overColIds = overCol.cardIds.filter((id) => id !== cardId);

  //   const overCardIndex = overColIds.findIndex((id) => id === overId);

  //   overColIds.splice(overCardIndex, 0, cardId);

  //   const updateData = {
  //     [`columnData.${sourceColId}.cardIds`]: overColIds,
  //   };
  //   await updateStore({ storeId, updateData });
  //   return { message: "Card moved source id and over id the same" };
  // }

  // const overCardIndex = overCol.cardIds.findIndex((id) => id === overId);

  // const newOverColIds = [...overCol.cardIds];

  // newOverColIds.splice(overCardIndex, 0, cardId);

  // const updateData = {
  //   [`columnData.${sourceColId}.cardIds`]: FieldValue.arrayRemove(cardId),
  //   [`columnData.${overColId}.cardIds`]: newOverColIds,
  // };

  // await updateStore({ storeId, updateData });
};

export const sortCard = async ({
  storeId,
  cardId,
  index,
  containerId,
  srcContainerId,
}: {
  storeId: string;
  cardId: string;
  index: number;
  containerId: string;
  srcContainerId: string;
}) => {
  const storeDoc = await readStore(storeId);
  if (!storeDoc) {
    throw new Error("No store found");
  }

  const { columnData, columnOrder } = storeDoc;

  const containerIdIndex = columnOrder.findIndex((id) => id === containerId);

  if (containerIdIndex === -1) {
    return { message: "Container not found" };
  }

  const containerIdInColumnData = columnData.hasOwnProperty(containerId);

  if (!containerIdInColumnData) {
    return { message: "Container not found" };
  }

  const sameCol = containerId === srcContainerId;

  const container = columnData[containerId];

  if (sameCol) {
    const tempCardIds = [...container.cardIds].filter((id) => id !== cardId);
    tempCardIds.splice(index, 0, cardId);

    const updateData = {
      [`columnData.${containerId}.cardIds`]: tempCardIds,
    };

    await updateStore({ storeId, updateData });

    return {
      message: `Card sorted in same column`,
      container: `${containerId} is equal to ${srcContainerId}`,
    };
  }

  const tempCardIds = [...container.cardIds];
  tempCardIds.splice(index, 0, cardId);

  const updateData = {
    [`columnData.${containerId}.cardIds`]: tempCardIds,
    [`columnData.${srcContainerId}.cardIds`]: FieldValue.arrayRemove(cardId),
  };

  await updateStore({ storeId, updateData });
  return { message: "Card sorted in different column" };
};
