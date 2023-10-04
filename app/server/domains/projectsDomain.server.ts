// import { Item } from "~/ui/work/Pages/ProjectsPage";
import {
  // Project,
  ProjectBase,
  ProjectStartFields,
  ProjectStatuses,
  createProject,
  readProject,
  getProjectsByStatus,
  projectStatuses,
  ProjectTask,
  updateProject,
  Project,
} from "../database/projects.server";
import { redirect } from "@remix-run/node";
import {
  TaskBase,
  createTask,
  makeTaskRef,
  readTask,
  setTask,
  updateTask,
} from "../database/tasks.server";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getProducts } from "../database/product.server";
import { readTaskList } from "../database/tasklist.server";
import { Item, ProjectSummary } from "./domain-types";
import { getProposalData } from "./proposals-domain.server";
import { readProposal } from "../database/proposals.server";
import { ProjectTableRow } from "~/components/projects/comp/project-columns";
import { makeDomainFunction } from "domain-functions";
import {
  EditProjectSchema,
  NewTaskSchema,
  ToggleTaskSchema,
} from "./project-schemas";

const createArrayValidProjectTasks = (project: Project) => {
  const projectTasks = project.taskIdList
    .filter((taskId) => project.projectTasks.hasOwnProperty(taskId))
    .map((taskId) => project.projectTasks[taskId]);

  return projectTasks;
};

const calculateProjectSummary = (tasks: ProjectTask[]) => {
  const totalPoints = tasks.reduce((acc, task) => {
    return acc + task.taskPoints;
  }, 0);

  const completedPoints = tasks.reduce((acc, task) => {
    return acc + (task.completed ? task.taskPoints : 0);
  }, 0);

  return {
    totalPoints,
    completedPoints,
  };
};

export const getProjectItemsByStatus = async ({
  storeId,
  status,
}: {
  storeId: string;
  status: ProjectStatuses;
}) => {
  const isValidStatus = projectStatuses.includes(status);

  const searchStatus = isValidStatus ? status : "active";

  const projects = await getProjectsByStatus({
    storeId,
    status: searchStatus,
  });

  const projectItems: ProjectTableRow[] = projects.map((project) => {
    const projectTasks = createArrayValidProjectTasks(project);

    const { completedPoints, totalPoints } =
      calculateProjectSummary(projectTasks);

    const projectItem: ProjectTableRow = {
      id: project.id,
      title: project.title,
      completedPoints: completedPoints,
      totalPoints: totalPoints,
      amount: project.invoiceAmount,
      status: project.status,
    };

    return projectItem;
  });

  return { projectItems };
};

export const updateProjectBasic = async ({
  storeId,
  projectId,
  projectData,
}: {
  storeId: string;
  projectId: string;
  projectData: {
    title: string;
    notes: string;
    invoiceAmount: number;
  };
}) => {
  const updateData = {
    title: projectData.title,
    notes: projectData.notes,
    invoiceAmount: projectData.invoiceAmount,
  };

  await updateProject({
    storeId,
    projectId,
    project: updateData,
  });

  return { projectId, success: true };
};

export const getProjectData = async ({
  projectId,
  storeId,
}: {
  projectId: string;
  storeId: string;
}) => {
  const project = await readProject({
    projectId,
    storeId,
  });

  if (!project) {
    throw new Response("Project not found", { status: 404 });
  }

  const createdAt = project.createdAt as Timestamp;

  const projectBasic = {
    id: project.id,
    title: project.title,
    status: project.status,
    notes: project.notes,
    createdAt: createdAt.toDate().toJSON(),
  };

  const summary: ProjectSummary = {
    amount: project.invoiceAmount,
    earned: 0,
  };

  const blockData = project.blockData;

  const proposalIds = project.blockOrder.filter((blockId) => {
    return (
      blockData.hasOwnProperty(blockId) &&
      blockData[blockId].type === "proposal"
    );
  });

  const proposalCalls = await Promise.all(
    proposalIds.map((proposalId) => getProposalData({ storeId, proposalId }))
  );

  const proposals = proposalCalls.map((proposalCall) => {
    return proposalCall.proposalReview;
  });

  const tasks = project.taskIdList
    .filter((taskId) => project.projectTasks.hasOwnProperty(taskId))
    .map((taskId) => project.projectTasks[taskId]);

  return { project: projectBasic, summary, tasks, proposals };
};

export const getProjectDataForEdit = async ({
  projectId,
  storeId,
}: {
  projectId: string;
  storeId: string;
}) => {
  const project = await readProject({
    projectId,
    storeId,
  });

  if (!project) {
    throw new Response("Project not found", { status: 404 });
  }

  const projectBasic = {
    id: project.id,
    title: project.title,
    status: project.status,
    notes: project.notes,
    invoiceAmount: project.invoiceAmount,
  };

  return { project: projectBasic };
};

export const makeProjectFromProposal = async ({
  storeId,
  proposalId,
  projectData,
}: {
  storeId: string;
  proposalId: string;
  projectData: ProjectStartFields;
}) => {
  const proposal = await readProposal({ storeId, proposalId });
  if (!proposal) {
    throw redirect(`/review`);
  }

  const project: ProjectBase = {
    title: projectData.title,
    status: "active",
    notes: projectData.notes,
    invoiceAmount: projectData.invoiceAmount,
    taskIdList: [],
    projectTasks: {},
    uuid: projectData.uuid,
    blockData: {
      [proposalId]: {
        type: "proposal",
        docId: proposalId,
        id: proposalId,
      },
    },
    blockOrder: [proposalId],
  };

  const newProjectId = await createProject({
    storeId,
    project,
  });

  return { newProjectId };
};

export const getAddTaskData = async ({
  storeId,
  projectId,
}: {
  storeId: string;
  projectId: string;
}) => {
  const project = await readProject({
    storeId,
    projectId,
  });

  if (!project) {
    throw new Response("Project not found", { status: 404 });
  }

  return {
    projectId,
    projectTitle: project.title,
  };
};

const addProjectTask = async ({
  storeId,
  projectId,
  taskData,
}: {
  storeId: string;
  projectId: string;
  taskData: ProjectTask;
}) => {
  const updateData = {
    [`projectTasks.${taskData.id}`]: taskData,
    taskIdList: FieldValue.arrayUnion(taskData.id),
  };

  return await updateProject({
    storeId,
    projectId,
    project: updateData,
  });
};

interface TaskFields extends Omit<TaskBase, "projectTitle"> {}

export const addTaskToProject = async ({
  storeId,
  projectId,
  taskData,
}: {
  storeId: string;
  projectId: string;
  taskData: TaskFields;
}) => {
  const project = await readProject({
    storeId,
    projectId,
  });

  if (!project) {
    throw new Response("Project not found", { status: 404 });
  }

  const projectTitle = project.title;

  const newTaskId = await createTask({
    storeId,
    taskData: { ...taskData, projectTitle },
  });

  const projectTask: ProjectTask = {
    id: newTaskId,
    title: taskData.title,
    taskPoints: taskData.taskPoints,
    completed: taskData.completed,
  };

  await addProjectTask({
    storeId,
    projectId,
    taskData: projectTask,
  });

  const taskTitle = taskData.title;

  return { newTaskId, success: true, taskTitle };
};

const updateTaskComplete = async ({
  storeId,
  taskId,
  completed,
}: {
  storeId: string;
  taskId: string;
  completed: boolean;
}) => {
  const updateData = {
    completed,
    completedOn: completed ? FieldValue.serverTimestamp() : FieldValue.delete(),
  };

  await updateTask({
    storeId,
    taskId,
    taskData: updateData,
  });

  return { taskId };
};

export const toggleTaskComplete = async ({
  storeId,
  projectId,
  taskId,
  completed,
}: {
  storeId: string;
  projectId: string;
  taskId: string;
  completed: boolean;
}) => {
  const task = await readTask({
    storeId,
    taskId,
  });

  if (!task) {
    throw new Response("Task not found", { status: 404 });
  }

  await updateTaskComplete({
    storeId,
    taskId,
    completed,
  });

  const updateData = {
    [`projectTasks.${taskId}.completed`]: completed,
  };

  await updateProject({
    storeId,
    projectId,
    project: updateData,
  });

  return { taskId, success: true };
};

export const getProductsForAddingTasklist = async ({
  storeId,
}: {
  storeId: string;
}) => {
  const products = await getProducts({
    storeId,
  });

  const productsList = products.map((product) => {
    return {
      id: product.id,
      name: product.basic.name,
    };
  });

  return { productsList };
};

export const addListofTasksToProject = async ({
  storeId,
  projectId,
  tasklistId,
  productId,
  uuid,
}: {
  storeId: string;
  projectId: string;
  tasklistId: string;
  productId: string;
  uuid: string;
}) => {
  const tasklist = await readTaskList({
    storeId,
    taskListId: tasklistId,
    productId,
  });

  if (!tasklist) {
    throw new Response("Tasklist not found", { status: 404 });
  }

  const project = await readProject({
    storeId,
    projectId,
  });

  if (!project) {
    throw new Response("Project not found", { status: 404 });
  }

  const validTaskIds = tasklist.taskOrder.filter((taskId) => {
    return tasklist.taskDetails.hasOwnProperty(taskId);
  });

  const tasksData = validTaskIds.map((taskId) => {
    const taskRef = makeTaskRef({ storeId });
    return {
      ...tasklist.taskDetails[taskId],
      id: taskRef.id,
    };
  });

  const writeTasks = tasksData.map((taskData) => {
    const task = {
      ...taskData,
      projectId: projectId,
      projectTitle: project.title,
      uuid,
      createdAt: FieldValue.serverTimestamp(),
    };

    const completeTaskData = task.completed
      ? { ...task, completedOn: FieldValue.serverTimestamp() }
      : task;

    return setTask({
      storeId,
      task: completeTaskData,
    });
  });

  await Promise.all(writeTasks);

  const projectTasks = tasksData.map((taskData) => {
    return {
      id: taskData.id,
      title: taskData.title,
      taskPoints: taskData.taskPoints,
      completed: taskData.completed,
    };
  });

  const projectTaskData = projectTasks.reduce((acc, task) => {
    return {
      ...acc,
      [`projectTasks.${task.id}`]: task,
    };
  }, {});

  const tasksIdsToAdd = tasksData.map((task) => task.id);

  const updateData = {
    taskIdList: FieldValue.arrayUnion(...tasksIdsToAdd),
    ...projectTaskData,
  };

  await updateProject({
    storeId,
    projectId,
    project: updateData,
  });

  return {
    message: "success",
  };
};

export const updateProjectStatus = async ({
  storeId,
  projectId,
  status,
}: {
  storeId: string;
  projectId: string;
  status: ProjectStatuses;
}) => {
  const project = await readProject({
    storeId,
    projectId,
  });

  if (!project) {
    throw new Response("Project not found", { status: 404 });
  }

  const updateData = {
    status,
  };

  await updateProject({
    storeId,
    projectId,
    project: updateData,
  });

  return { projectId };
};

// mutations
export const updateProjectMutation = (idObj: {
  storeId: string;
  projectId: string;
}) => {
  return makeDomainFunction(EditProjectSchema)(async (data) => {
    return await updateProjectBasic({
      storeId: idObj.storeId,
      projectId: idObj.projectId,
      projectData: {
        title: data.title,
        notes: data.notes,
        invoiceAmount: data.invoiceAmount,
      },
    });
  });
};

export const addTaskToProjectMutation = (idObj: {
  storeId: string;
  projectId: string;
  uuid: string;
}) => {
  return makeDomainFunction(NewTaskSchema)(async (data) => {
    return await addTaskToProject({
      storeId: idObj.storeId,
      projectId: idObj.projectId,
      taskData: {
        projectId: idObj.projectId,
        title: data.title,
        notes: data.notes,
        taskPoints: Number(data.taskPoints),
        completed: false,
        uuid: idObj.uuid,
      },
    });
  });
};

export const toggleTaskMutation = (idObj: {
  storeId: string;
  projectId: string;
}) => {
  return makeDomainFunction(ToggleTaskSchema)(async (data) => {
    return await toggleTaskComplete({
      storeId: idObj.storeId,
      taskId: data.taskId,
      completed: data.completed === "true" ? true : false,
      projectId: idObj.projectId,
    });
  });
};
