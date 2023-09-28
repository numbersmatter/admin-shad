import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { projectsColumnsLong, projectsColumnsShort, projectsTestData } from "~/components/projects/comp/project-columns";
import { ProjectDataTable } from "~/components/projects/comp/project-data-table";
import { ProjectHeader } from "~/components/projects/comp/project-header";
import ProjectStatusSelect from "~/components/projects/comp/project-status-select";

export async function loader({ params, request }: LoaderFunctionArgs) {
  //  const {storeId, uid, session} = await intializeWorkSession(request); 

  const projects = projectsTestData;


  return json({ projects });
}


export default function ProjectsIdRoute() {
  const { projects } = useLoaderData<typeof loader>();
  return (
    <>
      <main className="flex h-full flex-1 flex-col space-y-8 overflow-y-auto">
        <ProjectHeader
          title="Buttons Commission"
          status="active"
          projectId="1234567890"
          statusSelect={<ProjectStatusSelect status="active" />}
        />
      </main>
    </>
  )


}

