export type Card = {
  id: string;
  name: string;
  linkTo: string;
};

export interface Column {
  id: string;
  name: string;
  cards: Card[];
}

export type CardData = {
  [cardId: string]: { id: string; name: string; linkTo: string };
};

export type ColData = {
  [columnId: string]: {
    id: string;
    name: string;
    cardIds: string[];
  };
};
