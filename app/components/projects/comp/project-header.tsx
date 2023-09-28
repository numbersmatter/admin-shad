import { Link } from "@remix-run/react";
import { ProjectStatuses } from "~/server/database/projects.server";
import ProjectStatusSelect from "./project-status-select";



export function ProjectHeader({
  title,
  status,
  statusSelect: StatusSelect,
  projectId,
}: {
  title: string,
  projectId: string,
  status: ProjectStatuses,
  statusSelect: React.ReactNode
}) {
  return (
    <header className="relative isolate pt-16">
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute left-16 top-full -mt-16 transform-gpu opacity-50 blur-3xl xl:left-1/2 xl:-ml-80">
          <div
            className="aspect-[1154/678] w-[72.125rem] bg-gradient-to-br from-primary to-primary-foreground"
            style={{
              clipPath: 'polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)',
            }} />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gray-900/5" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-x-8 lg:mx-0 lg:max-w-none">
          <div className="flex items-center gap-x-6">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/furry-artist.appspot.com/o/furbrush%2FFM%20logo%201.png?alt=media&token=fb824224-21ca-4337-b6b9-0fb94b4005d1"
              alt=""
              className="h-16 w-16 flex-none rounded-full ring-1 ring-gray-900/10" />
            <h1>
              <div className="text-sm leading-6 ">
                Project Id: <span className="">{projectId}</span>
              </div>
              <div className="mt-1 text-3xl font-semibold leading-6 ">
                {title}
              </div>
            </h1>
          </div>
          <div className="flex items-center gap-x-4 sm:gap-x-6">
            {StatusSelect}
          </div>
        </div>
      </div>
    </header>
  )

}