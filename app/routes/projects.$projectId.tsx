import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { projectsColumnsLong, projectsColumnsShort, projectsTestData } from "~/components/projects/comp/project-columns";
import { ProjectDataTable } from "~/components/projects/comp/project-data-table";
import { ProjectHeader } from "~/components/projects/comp/project-header";
import ProjectStatusSelect from "~/components/projects/comp/project-status-select";
import { useToast } from "~/components/ui/use-toast";
import { ProjectDetails } from "~/components/projects/comp/project-details";
import { ProjectEditDialogue } from "~/components/projects/comp/project-edit-dialogue";



export async function action({ request }: LoaderFunctionArgs) {
  const formData = await request.clone().formData();
  const action = formData.get("_action");

  switch (action) {
    case "toogleTask":
      return json({ status: "ok", message: "Task toggled" }, { status: 200 });
    default:
      return json({ status: "ok" }, { status: 200 });
  }



};




export async function loader({ params, request }: LoaderFunctionArgs) {
  //  const {storeId, uid, session} = await intializeWorkSession(request); 

  const project = {
    ...projectsTestData[2],
    notes: "Some notes about the project. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed",
    invoice: 250.00
  };
  const toastMessage = {
    hasMessage: false
  }


  return json({ project, toastMessage });
}


export default function ProjectsIdRoute() {
  const { project, } = useLoaderData<typeof loader>();






  return (
    <>
      <main className="flex h-full flex-1 flex-col space-y-8 overflow-y-auto">
        <ProjectHeader
          title="Buttons Commission"
          status="active"
          projectId="1234567890"
          statusSelect={<ProjectStatusSelect status="active" />}
        />
        <ProjectDetails
          editDialogue={
            <ProjectEditDialogue
              title={project.title}
              notes={project.notes}
              invoice={project.invoice}
            />
          }
        />
      </main>
    </>
  )


}

