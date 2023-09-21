import { DocumentData } from "firebase-admin/firestore";
import { dataPoint, mainDb } from "./mainDb.server";

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

interface Store {
  id: string;
  uuid: string;
  storeName: string;
  storeStatus: string;
  columnData: ColData;
  columnOrder: string[];
}

const storeCollection = dataPoint<Store>(`${mainDb}/stores`);

// Store CRUD

export const createStore = async (storeData: Store) => {
  await storeCollection.doc(storeData.id).set(storeData);
  return storeData.id;
};

export const readStore = async (storeId: string) => {
  const storeData = await storeCollection.doc(storeId).get();
  return storeData.data();
};

export const updateStore = async ({
  storeId,
  updateData,
}: {
  storeId: string;
  updateData: DocumentData;
}) => {
  return await storeCollection.doc(storeId).update(updateData);
};

export const deleteStore = async (storeId: string) => {
  await storeCollection.doc(storeId).delete();
};
