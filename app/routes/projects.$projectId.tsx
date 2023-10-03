import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { projectsColumnsLong, projectsColumnsShort, projectsTestData } from "~/components/projects/comp/project-columns";
import { ProjectDataTable } from "~/components/projects/comp/project-data-table";
import { ProjectHeader } from "~/components/projects/comp/project-header";
import ProjectStatusSelect from "~/components/projects/comp/project-status-select";
import { useToast } from "~/components/ui/use-toast";
import { ProjectDetails } from "~/components/projects/comp/project-details";
import { ProjectEditDialogue } from "~/components/projects/comp/project-edit-dialogue";
import { intializeWorkSession } from "~/server/auth/auth-work-session.server";
import { getProjectData, getProjectItemsByStatus, updateProjectMutation } from "~/server/domains/projectsDomain.server";
import { ProjectStatuses, projectStatuses } from "~/server/database/projects.server";
import { ProjectTaskList } from "~/components/projects/comp/project-task-list";
import { projectTaskColumnsLong, projectTaskColumnsShort } from "~/components/projects/comp/task-columns";
import { formAction } from "~/server/form-actions/form-action.server";
import { EditProjectSchema } from "~/server/domains/project-schemas";




export async function action({ request, params }: ActionFunctionArgs) {
  const { storeId, uid, session } = await intializeWorkSession(request);
  const projectId = params.projectId ?? "none";
  const formData = await request.clone().formData();
  const action = formData.get("_action");

  switch (action) {
    case "toogleTask":
      return json({ status: "ok", message: "Task toggled" }, { status: 200 });
    case "updateBasic":
      return formAction({
        request,
        mutation: updateProjectMutation({ storeId, projectId }),
        schema: EditProjectSchema,
      });
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
          createdAt="11/12/2020"
          editDialogue={
            <ProjectEditDialogue
              title={project.title}
              notes={project.notes}
              invoice={summary.amount}
            />
          }
        >
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
      </main>
    </>
  )


}

