import { CardData, ColData } from "./workboard-types";

export const constructColumns = (
  columnOrder: string[],
  colData: ColData,
  cardData: CardData
) => {
  return columnOrder.map((colId) => {
    const col = colData[colId];
    const cardsPresent = col.cardIds.filter((cardId) => cardData.hasOwnProperty(cardId));
    return {
      ...col,
      cards: cardsPresent.map((cardId) => cardData[cardId]),
    };

  });
};