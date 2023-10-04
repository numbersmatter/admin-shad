import type { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { getFirestore } from "firebase-admin/firestore";

// helper function to convert firestore data to typescript
const converter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T,
});

const convertDifferentReadAndWrite = <T, U>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as U,
});

// export const dataPointDifferentReadAndWrite = <T, U>(
//   collectionPath: string
// ) => getFirestore().collection(collectionPath).withConverter(convertDifferentReadAndWrite<T, U>());

// helper to apply converter to multiple collections
export const dataPoint = <T extends FirebaseFirestore.DocumentData>(
  collectionPath: string
) => getFirestore().collection(collectionPath).withConverter(converter<T>());

export const mainDb = "servicely/furbrush";

export const randomId = () => {
  return Math.random().toString(36).substring(2, 15);
};
