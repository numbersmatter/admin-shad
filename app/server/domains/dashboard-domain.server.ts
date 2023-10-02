import { Timestamp } from "firebase-admin/firestore";
import { readStore, updateStore } from "../database/store.server";
import { getAllTasksCompletedAfterDate } from "../database/tasks.server";
import { getDashboardProductItems } from "./productDomain.server";
import { getTasksData } from "./tasksDomain.server";
import { ProjectTask, readProject } from "../database/projects.server";

export const getDashboardData = async ({ storeId }: { storeId: string }) => {
  const storeDoc = await readStore(storeId);
  if (!storeDoc) {
    throw new Error("Store not found");
  }

  const storeStatus = storeDoc.storeStatus;

  const {
    tasksFromLastMonth,
    lastMonthTasks,
    thisMonthsTasks,
    lastMonthProjectIds,
    thisMonthsProjectIds,
    allProjectIds,
  } = await getTasksData({ storeId });

  const projectsWorkedOnCall = allProjectIds.map((projectId) => {
    return readProject({ storeId, projectId });
  });

  const projectsWorkedOn = await Promise.allSettled(projectsWorkedOnCall);

  // TODO: Fix this
  const projectsWorked = projectsWorkedOn
    .filter((p) => p.hasOwnProperty("value"))
    .map((p: any) => {
      const projectTasks = p.value.projectTasks as {
        [key: string]: ProjectTask;
      };

      const taskIds = p.value.taskIdList as string[];

      const filteredTaskIds = taskIds.filter((taskId) =>
        projectTasks.hasOwnProperty(taskId)
      );

      const tasks = filteredTaskIds.map((taskId) => projectTasks[taskId]);

      const tasksCompleted = tasks.filter((task) => task.completed);
      const completedTaskPoints = tasksCompleted.reduce(
        (acc, task) => acc + task.taskPoints,
        0
      );

      const totalTaskPoints = tasks.reduce(
        (acc, task) => acc + task.taskPoints,
        0
      );

      const earnedPercent = completedTaskPoints / totalTaskPoints;
      const earned = earnedPercent * p.value.invoiceAmount;

      let rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu");

      let initials = [...p.value.title.matchAll(rgx)] || [];

      initials = (
        (initials.shift()?.[1] || "") + (initials.pop()?.[1] || "")
      ).toUpperCase();

      return {
        id: p.value.id as string,
        invoiceAmount: p.value.invoiceAmount as number,
        taskIdList: p.value.taskIdList as string[],
        projectTasks: p.value.projectTasks as { [key: string]: ProjectTask },
        title: p.value.title as string,
        totalPoints: totalTaskPoints,
        completedPoints: completedTaskPoints,
        totalTasks: tasks.length,
        earned: earned.toFixed(2),
        initials,
      };
    });

  const projectsWithTotals = projectsWorked
    .map((project) => {
      const tasklist = project?.taskIdList ?? [];
      const projectTasksObj = project?.projectTasks ?? {};

      const projectTasks = tasklist
        .filter((taskId) => projectTasksObj.hasOwnProperty(taskId))
        .map((taskId) => projectTasksObj[taskId]);

      const totalPoints = projectTasks.reduce(
        (acc, task) => acc + task.taskPoints,
        0
      );

      return {
        ...project,
        invoiceAmount: project?.invoiceAmount ?? 0,
        id: project?.id,
        totalPoints,
        totalTasks: projectTasks.length,
      };
    })
    .reduce((acc, project) => {
      return {
        ...acc,
        [project.id]: project,
      };
    }, {}) as {
    [key: string]: {
      id: string;
      totalPoints: number;
      totalTasks: number;
      invoiceAmount: number;
    };
  };

  // TODO: Fix this
  const lastMonthTasksWithEarned = lastMonthTasks.map((task) => {
    const project = projectsWithTotals[task.projectId];

    const earnedPercent = (task.taskPoints / project.totalPoints) * 100;
    const earnedAmount =
      (task.taskPoints / project.totalPoints) * project.invoiceAmount;

    return {
      ...task,
      earnedPercent,
      earnedAmount,
    };
  });
  const thisMonthTasksWithEarned = thisMonthsTasks.map((task) => {
    const project = projectsWithTotals[task.projectId];

    const earnedPercent = (task.taskPoints / project.totalPoints) * 100;
    const earnedAmount =
      (task.taskPoints / project.totalPoints) * project.invoiceAmount;

    return {
      ...task,
      earnedPercent,
      earnedAmount,
    };
  });

  const numberOfTasksCompletedLastMonth = lastMonthTasks.length;
  const numberOfTasksCompletedThisMonth = thisMonthsTasks.length;

  const lastMonthPoints = lastMonthTasks.reduce(
    (acc, task) => acc + task.taskPoints,
    0
  );

  const thisMonthPoints = thisMonthsTasks.reduce(
    (acc, task) => acc + task.taskPoints,
    0
  );

  const thisMonthEarned = thisMonthTasksWithEarned.reduce(
    (acc, task) => acc + task.earnedAmount,
    0
  );

  const lastMonthEarned = lastMonthTasksWithEarned.reduce(
    (acc, task) => acc + task.earnedAmount,
    0
  );

  const currentDate = new Date();

  const currentMonth = currentDate.toLocaleString("default", { month: "long" });

  const productsList = await getDashboardProductItems({ storeId });
  const dashboardData = {
    monthLabel: currentMonth,
    lastMonthPoints: lastMonthPoints.toString(),
    thisMonthPoints: thisMonthPoints.toString(),
    lastMonthTasks: numberOfTasksCompletedLastMonth.toString(),
    thisMonthTasks: numberOfTasksCompletedThisMonth.toString(),
    lastMonthEarned: lastMonthEarned.toFixed(2).toString(),
    thisMonthEarned: thisMonthEarned.toFixed(2).toString(),
    lastMonthEarnedAmount: Math.round(lastMonthEarned),
    thisMonthEarnedAmount: Math.round(thisMonthEarned),
  };

  const dashboardProjects = projectsWorked;

  return {
    storeStatus,
    productsList,
    dashboardData,
    dashboardProjects,
  };
};

const toggleProviderStoreStatus = async (
  storeId: string,
  storeStatus: string
) => {
  const updateData = {
    storeStatus: storeStatus,
  };

  await updateStore({ storeId, updateData });
};

// const toggleProductAvailability = async ({
//   productId,
//   storeId,
//   availability,
// }: {
//   productId: string;
//   storeId: string;
//   availability: string;
// }) => {
//   const updateData = {
//     availability: availability,
//   };

//   await updateStore(storeId, updateData);
// };

export const dashboardActions = {
  toggleProviderStoreStatus,
  // toggleProductAvailability,
};

// Query all tasks completed since Aug 1
