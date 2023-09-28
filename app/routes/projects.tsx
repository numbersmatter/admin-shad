
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { projectsColumns, projectsTestData } from "~/components/projects/comp/project-columns";
import { ProjectDataTable } from "~/components/projects/comp/project-data-table";
import { ProjectsList } from "~/components/projects/projects-list";
import { StandardShell } from "~/components/shell/shell";

export async function action({ params, request }: ActionFunctionArgs) {
  //  const {storeId, uid, session} = await intializeWorkSession(request);  

  return json({});
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  //  const {storeId, uid, session} = await intializeWorkSession(request);  


  return json({});
}



export default function ProjectsRoute() {
  const { } = useLoaderData<typeof loader>();
  return (
    <StandardShell>
      <main className="flex h-full flex-1 flex-col space-y-8 overflow-y-auto">
        <div className="flex items-center justify-between space-y-2 p-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
          <div className="flex items-center space-x-2">
          </div>
        </div>
        <div className="px-0 md:px-4">
          <div className="border-0  border-accent-foreground  md:border-2 md:rounded-md ">
            <ProjectDataTable columns={projectsColumns} data={projectsTestData} />
          </div>
        </div>
      </main>
    </StandardShell>
  );
}

