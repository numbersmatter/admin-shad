import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import {
  useLoaderData,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import { ProjectHeader } from "~/components/projects/comp/project-header";
import ProjectStatusSelect from "~/components/projects/comp/project-status-select";
import { ProjectDetails } from "~/components/projects/comp/project-details";
import { ProjectEditDialogue } from "~/components/projects/comp/project-edit-dialogue";
import { intializeWorkSession } from "~/server/auth/auth-work-session.server";
import { addTaskToProjectMutation, getProjectData, getProjectItemsByStatus, toggleTaskMutation, updateProjectMutation } from "~/server/domains/projectsDomain.server";
import { ProjectTaskList } from "~/components/projects/comp/project-task-list";
import { projectTaskColumnsLong, projectTaskColumnsShort } from "~/components/projects/comp/task-columns";
import { formAction } from "~/server/form-actions/form-action.server";
import { EditProjectSchema, NewTaskSchema, ToggleTaskSchema } from "~/server/domains/project-schemas";
import { AddTaskDialog } from "~/components/projects/comp/add-task-dialog";
import { ProjectProposalCard } from "~/components/projects/comp/project-proposal-card";

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}




export async function action({ request, params }: ActionFunctionArgs) {
  const { storeId, uid, session } = await intializeWorkSession(request);
  const projectId = params.projectId ?? "none";
  const formData = await request.clone().formData();
  const action = formData.get("_action");

  switch (action) {
    case "toogleTask":
      return formAction({
        request,
        mutation: toggleTaskMutation({ storeId, projectId }),
        schema: ToggleTaskSchema,
      })
    case "updateBasic":
      return formAction({
        request,
        mutation: updateProjectMutation({ storeId, projectId }),
        schema: EditProjectSchema,
      });
    case "addTask":
      return formAction({
        request,
        mutation: addTaskToProjectMutation({ storeId, projectId, uuid: uid }),
        schema: NewTaskSchema
      })
    default:
      return json({ status: "ok" }, { status: 200 });
  }



};




export async function loader({ params, request }: LoaderFunctionArgs) {
  const { storeId, uid, session } = await intializeWorkSession(request);

  const { project, summary, tasks, proposals } = await getProjectData({
    storeId,
    projectId: params.projectId ?? "none",
  })


  // const project = {
  //   ...projectsTestData[2],
  //   notes: "Some notes about the project. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed",
  //   invoice: 250.00
  // };


  return json({ project, summary, tasks, proposals });
}



export default function ProjectsIdRoute() {
  const { project, summary, tasks, proposals } = useLoaderData<typeof loader>();

  const createdAtString = new Date(project.createdAt).toLocaleDateString();



  return (
    <>
      <main className="flex h-full flex-1 flex-col space-y-8 overflow-y-auto">
        <ProjectHeader
          title={project.title}
          status={project.status}
          projectId={project.id}
          statusSelect={<ProjectStatusSelect status={project.status} />}
        />
        <ProjectDetails
          notes={project.notes}
          createdAt={createdAtString}
          editDialogue={
            <ProjectEditDialogue
              title={project.title}
              notes={project.notes}
              invoice={summary.amount}
            />
          }
        >
          <div>
            <AddTaskDialog />
          </div>
          <div className="p-2 bg-popover border-1 rounded-sm md:hidden">
            <ProjectTaskList
              columns={projectTaskColumnsShort}
              data={tasks}
            />
          </div>
          <div className="hidden p-2 bg-popover border-1 rounded-sm md:block">
            <ProjectTaskList
              columns={projectTaskColumnsLong}
              data={tasks}
            />
          </div>
        </ProjectDetails>
        <div className="px-0  md:px-6 lg:px-20">
          {
            proposals.length > 0 &&
            <ProjectProposalCard
              proposalReview={proposals[0]}
            />

          }
        </div>

      </main>
    </>
  )


}

