import { DocumentData, FieldValue, Timestamp } from "firebase-admin/firestore";
import { z } from "zod";
import { dataPoint, mainDb } from "./mainDb.server";

// Interfaces
export interface ProjectTask {
  id: string;
  title: string;
  taskPoints: number;
  completed: boolean;
  // archived: boolean;
}

export type ProjectStatuses = "active" | "canceled" | "completed" | "inactive";

export const projectStatuses: ProjectStatuses[] = [
  "active",
  "canceled",
  "completed",
  "inactive",
];

export interface ProjectStartFields {
  title: string;
  notes: string;
  uuid: string;
  invoiceAmount: number;
}

export interface BlockOfdata {
  type: "proposal" | "artistForm" | "ver4";
  id: string;
  docId: string;
}

export interface ProjectBase {
  title: string;
  notes: string;
  uuid: string;
  taskIdList: string[];
  projectTasks: {
    [taskId: string]: ProjectTask;
  };
  invoiceAmount: number;
  status: ProjectStatuses;
  blockOrder: string[];
  blockData: {
    [blockId: string]: BlockOfdata;
  };
}
export interface ProjectFieldsFromProposal extends ProjectBase {}

export const StatusSchemaChange = z.object({
  projectId: z.string().min(1),
  projectStatus: z.enum(["active", "canceled", "completed", "inactive"]),
});

export interface ProjectTemplateBase extends ProjectBase {
  id: string;
}

type BlockType = "proposal" | "artistForm";
export interface Project extends ProjectBase {
  id: string;
  createdAt: Timestamp | FieldValue;
}

const projectsCollection = (storeId: string) =>
  dataPoint<Project>(`${mainDb}/stores/${storeId}/projects`);

//
// CRUD Functions
//
//

export const createProject = async ({
  storeId,
  project,
}: {
  storeId: string;
  project: ProjectBase;
}) => {
  const newProject = projectsCollection(storeId).doc();
  await newProject.set({
    ...project,
    id: newProject.id,
    createdAt: FieldValue.serverTimestamp(),
  });

  return newProject.id;
};

export const setProject = async ({
  storeId,
  project,
}: {
  storeId: string;
  project: Project;
}) => {
  await projectsCollection(storeId).doc(project.id).set(project);
};

export const createFreshProject = async ({
  storeId,
  project,
}: {
  storeId: string;
  project: ProjectStartFields;
}) => {
  const newProject = await projectsCollection(storeId).doc();
  await newProject.set({
    invoiceAmount: project.invoiceAmount,
    title: project.title,
    notes: project.notes,
    uuid: project.uuid,
    id: newProject.id,
    taskIdList: [],
    projectTasks: {},
    status: "active",
    createdAt: FieldValue.serverTimestamp(),
    blockData: {},
    blockOrder: [],
  });

  return newProject.id;
};

export const createProjectFromProposal = async (
  providerId: string,
  project: ProjectFieldsFromProposal
) => {
  const newProject = await projectsCollection(providerId).doc();
  await newProject.set({
    ...project,
    id: newProject.id,
    uuid: "testid",
    createdAt: FieldValue.serverTimestamp(),
    blockData: project.blockData,
    blockOrder: project.blockOrder,
  });

  return newProject.id;
};

export const readProject = async ({
  projectId,
  storeId,
}: {
  storeId: string;
  projectId: string;
}) => {
  const project = await projectsCollection(storeId).doc(projectId).get();
  const projectData = project.data();

  if (!projectData) {
    return undefined;
  }

  return { ...projectData, id: project.id };
};

export const updateProject = async ({
  storeId,
  projectId,
  project,
}: {
  storeId: string;
  projectId: string;
  project: DocumentData;
}) => {
  await projectsCollection(storeId).doc(projectId).update(project);
};

export const getProjectsByStatus = async ({
  storeId,
  status,
}: {
  storeId: string;
  status: string;
}) => {
  console.log("status", status);
  const projectsFirebase = await projectsCollection(storeId)
    .where("status", "==", status)
    .get();

  const projects: Project[] = [];
  projectsFirebase.forEach((doc) => {
    projects.push({ ...doc.data(), id: doc.id });
  });
  return projects;
};

export const getAllProjects = async ({ storeId }: { storeId: string }) => {
  const storeProjectQuery = await projectsCollection(storeId).get();
  const projects: Project[] = [];
  storeProjectQuery.forEach((doc) => {
    projects.push({ ...doc.data(), id: doc.id });
  });
  return projects;
};

// // Specific Functions

// // Query functions
// export const getAllProjectsByUserId = async (providerId: string) => {
//   const projectsFirebase = await projectsCollection(providerId).get();
//   const projects: ProjectBase[] = [];
//   projectsFirebase.forEach((doc) => {
//     projects.push(doc.data());
//   });
//   return projects;
// };

// export const getActiveProjects = async (providerId: string) => {
//   const projectsFirebase = await projectsCollection(providerId)
//     .where("status", "==", "active")
//     .get();
//   const projects: ProjectBase[] = [];
//   projectsFirebase.forEach((doc) => {
//     projects.push(doc.data());
//   });
//   return projects;
// };

// export const createProjectTask = async ({
//   providerId,
//   projectId,
//   task,
// }: {
//   providerId: string;
//   projectId: string;
//   task: ProjectTask;
// }) => {
//   const project = await getProjectById({ providerId, projectId });

//   if (!project) {
//     throw new Response("Project not found", { status: 404 });
//   }

//   const updateProjectData = {
//     [`projectTasks.${task.id}`]: task,
//     taskIdList: FieldValue.arrayUnion(task.id),
//   };

//   await projectsCollection(providerId).doc(projectId).update(updateProjectData);
// };

// export const updateProjectTask = async ({
//   providerId,
//   projectId,
//   taskId,
//   task,
// }: {
//   providerId: string;
//   projectId: string;
//   taskId: string;
//   task: ProjectTask;
// }) => {};

// export const toggleProjectTask = async ({
//   providerId,
//   projectId,
//   taskId,
//   completed,
// }: {
//   providerId: string;
//   projectId: string;
//   taskId: string;
//   completed: boolean;
// }) => {
//   const updateProjectData = {
//     [`projectTasks.${taskId}.completed`]: completed,
//   };

//   // @ts-ignore
//   await projectsCollection(providerId).doc(projectId).update(updateProjectData);

//   return taskId;
// };

// export const updateProjectStatus = async ({
//   providerId,
//   projectId,
//   status,
// }: {
//   providerId: string;
//   projectId: string;
//   status: ProjectStatuses;
// }) => {
//   const updateProjectData = {
//     status,
//   };

//   // @ts-ignore
//   await projectsCollection(providerId).doc(projectId).update(updateProjectData);

//   return projectId;
// };
