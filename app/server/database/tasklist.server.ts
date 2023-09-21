import { DocumentData } from "firebase-admin/firestore";
import { dataPoint, mainDb } from "./mainDb.server";

export interface TaskList {
  id: string;
  title: string;
  notes: string;
  taskOrder: string[];
  taskDetails: {
    [key: string]: {
      title: string;
      notes: string;
      taskPoints: number;
      completed: boolean;
    };
  };
}

const taskListCollection = ({
  storeId,
  productId,
}: {
  storeId: string;
  productId: string;
}) =>
  dataPoint<TaskList>(
    `${mainDb}/stores/${storeId}/products/${productId}/tasklist`
  );

//
// TaskList CRUD
//
//

export const createTaskList = async ({
  storeId,
  productId,
  taskListData,
}: {
  storeId: string;
  productId: string;
  taskListData: TaskList;
}) => {
  const taskListRef = taskListCollection({ storeId, productId }).doc();

  const taskListWrite = await taskListRef.set({
    ...taskListData,
    id: taskListRef.id,
  });

  return taskListRef.id;
};

export const readTaskList = async ({
  storeId,
  productId,
  taskListId,
}: {
  storeId: string;
  productId: string;
  taskListId: string;
}) => {
  const taskListRef = taskListCollection({ storeId, productId }).doc(
    taskListId
  );

  const taskListCall = await taskListRef.get();

  return taskListCall.data();
};

export const updateTaskList = async ({
  storeId,
  productId,
  taskListId,
  taskListData,
}: {
  storeId: string;
  productId: string;
  taskListId: string;
  taskListData: DocumentData;
}) => {
  const taskListRef = taskListCollection({ storeId, productId }).doc(
    taskListId
  );

  const taskListWrite = await taskListRef.update(taskListData);

  return taskListWrite;
};

export const deleteTaskList = async ({
  storeId,
  productId,
  taskListId,
}: {
  storeId: string;
  productId: string;
  taskListId: string;
}) => {
  const taskListRef = taskListCollection({ storeId, productId }).doc(
    taskListId
  );

  const taskListWrite = await taskListRef.delete();

  return taskListWrite;
};

//
// TaskList queries

export const getTaskLists = async ({
  storeId,
  productId,
}: {
  storeId: string;
  productId: string;
}) => {
  const taskListRef = taskListCollection({ storeId, productId });

  const taskListCall = await taskListRef.get();

  const taskListData = taskListCall.docs.map((doc) => {
    const docData = doc.data();
    const validTaskIds = docData.taskOrder.filter((taskId) => {
      return docData.taskDetails.hasOwnProperty(taskId);
    });

    return {
      ...docData,
      numberTasks: validTaskIds.length,
    };
  });

  return taskListData;
};
