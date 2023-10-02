import { readStore } from "../database/store.server";
import {
  getAllTasks,
  getAllTasksCompletedAfterDate,
} from "../database/tasks.server";

export const getTasksData = async ({ storeId }: { storeId: string }) => {
  const storeDoc = await readStore(storeId);
  if (!storeDoc) {
    throw new Error("Store not found");
  }

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const lastMonthString = `${currentYear}-${currentMonth}-01`;
  const firstofLastMonth = new Date(currentYear, currentMonth - 1, 1, 0, 0, 0);
  const firstofThisMonth = new Date(currentYear, currentMonth, 1, 0, 0, 0);

  const tasksFromLastMonth = await getAllTasksCompletedAfterDate({
    storeId,
    date: firstofLastMonth,
  });

  const allTasksProjectIds = tasksFromLastMonth.map((task) => task.projectId);

  const lastMonthTasks = tasksFromLastMonth
    .filter((task) => task.completedOn.toDate() < firstofThisMonth)
    .map((task) => {
      return {
        ...task,
        completedDateString: task.completedOn.toDate().toLocaleDateString(),
      };
    });

  const lastMonthTaskIds = lastMonthTasks.map((task) => task.id);

  const thisMonthsTasks = tasksFromLastMonth
    .filter((task) => !lastMonthTaskIds.includes(task.id))
    .map((task) => {
      return {
        ...task,
        completedDateString: task.completedOn.toDate().toLocaleDateString(),
      };
    });

  const lastMonthProjectIdsAll = lastMonthTasks.map((task) => task.projectId);

  const lastMonthProjectIds = [...new Set(lastMonthProjectIdsAll)];

  const thisMonthsProjectIdsAll = thisMonthsTasks.map((task) => task.projectId);

  const thisMonthsProjectIds = [...new Set(thisMonthsProjectIdsAll)];

  const allProjectIds = [...new Set(allTasksProjectIds)];

  return {
    tasksFromLastMonth,
    lastMonthTasks,
    thisMonthsTasks,
    lastMonthProjectIds,
    thisMonthsProjectIds,
    allProjectIds,
  };
};
