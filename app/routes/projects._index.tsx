import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { projectsColumnsLong, projectsColumnsShort, projectsTestData } from "~/components/projects/comp/project-columns";
import { ProjectDataTable } from "~/components/projects/comp/project-data-table";

export async function loader({ params, request }: LoaderFunctionArgs) {
  //  const {storeId, uid, session} = await intializeWorkSession(request); 

  const projects = projectsTestData;


  return json({ projects });
}


export default function ProjectsIndexRoute() {
  const { projects } = useLoaderData<typeof loader>();
  return (
    <>
      <main className="flex h-full flex-1 flex-col space-y-8 overflow-y-auto">
        <div className="flex items-center justify-between space-y-2 p-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your projects!
            </p>
          </div>
          <div className="flex items-center space-x-2">
          </div>
        </div>
        <div className="hidden px-0 sm:block lg:px-4">
          <div className="border-0  border-accent-foreground  lg:border-2 lg:rounded-md lg:p-4 ">
            <ProjectDataTable
              columns={projectsColumnsLong} data={projects}
            />
          </div>
        </div>
        <div className="px-0  sm:hidden">
          <div className="">
            <ProjectDataTable
              columns={projectsColumnsShort}
              data={projects}
            />
          </div>
        </div>
        <div className="h-8" />
      </main>
    </>
  )


}

