import { dataPoint, mainDb } from "./mainDb.server";

export interface FurbrushUser {
  storeId: string;
  stores: string[];
}

const userCollection = dataPoint<FurbrushUser>(`${mainDb}/users`);

// User CRUD
export const createUser = async (userData: FurbrushUser) => {
  await userCollection.doc(userData.storeId).set(userData);
  return userData.storeId;
};

export const readUser = async (userId: string) => {
  const userData = await userCollection.doc(userId).get();
  return userData.data();
};
