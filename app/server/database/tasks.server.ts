import { DocumentData, FieldValue, Timestamp } from "firebase-admin/firestore";
import { dataPoint, mainDb } from "./mainDb.server";

export interface TaskBase {
  title: string;
  notes: string;
  taskPoints: number;
  projectId: string;
  projectTitle: string;
  completed: boolean;
  uuid: string;
}

export interface Task extends TaskBase {
  id: string;
  createdAt: Timestamp | FieldValue;
  completedOn?: Timestamp | FieldValue;
}
export interface TaskWithTimestamp extends TaskBase {
  id: string;
  createdAt: Timestamp;
  completedOn: Timestamp;
}

const tasksCollection = ({ storeId }: { storeId: string }) =>
  dataPoint<Task>(`${mainDb}/stores/${storeId}/tasks`);

//
// Task CRUD
//
//
export const makeTaskRef = ({ storeId }: { storeId: string }) => {
  return tasksCollection({ storeId }).doc();
};

export const createTask = async ({
  storeId,
  taskData,
}: {
  storeId: string;
  taskData: TaskBase;
}) => {
  const taskRef = tasksCollection({ storeId }).doc();

  const task = await taskRef.set({
    ...taskData,
    createdAt: FieldValue.serverTimestamp(),
    id: taskRef.id,
  });

  return taskRef.id;
};

export const setTask = async ({
  storeId,
  task,
}: {
  storeId: string;
  task: Task;
}) => {
  await tasksCollection({ storeId }).doc(task.id).set(task);
};

export const readTask = async ({
  storeId,
  taskId,
}: {
  storeId: string;
  taskId: string;
}) => {
  const task = await tasksCollection({ storeId }).doc(taskId).get();

  if (!task.exists) {
    return undefined;
  }

  return {
    ...task.data(),
    id: task.id,
  } as Task;
};

export const updateTask = async ({
  storeId,
  taskId,
  taskData,
}: {
  storeId: string;
  taskId: string;
  taskData: DocumentData;
}) => {
  return await tasksCollection({ storeId }).doc(taskId).update(taskData);
};

export const deleteTask = async ({
  storeId,
  taskId,
}: {
  storeId: string;
  taskId: string;
}) => {
  return await tasksCollection({ storeId }).doc(taskId).delete();
};

// Tasks query

export const getAllTasks = async ({ storeId }: { storeId: string }) => {
  const tasks = await tasksCollection({ storeId }).get();

  return tasks.docs.map((task) => {
    return {
      ...task.data(),
      id: task.id,
    } as Task;
  });
};
export const getAllTasksCompletedAfterDate = async ({
  storeId,
  date,
}: {
  storeId: string;
  date: Date;
}) => {
  const fireTimestamp = Timestamp.fromDate(date);

  const tasks = await tasksCollection({ storeId })
    .orderBy("completedOn", "desc")
    .where("completedOn", ">", fireTimestamp)
    .get();

  return tasks.docs.map((task) => {
    return {
      ...task.data(),
      completedOn: task.data().completedOn,
      id: task.id,
    } as TaskWithTimestamp;
  });
};
