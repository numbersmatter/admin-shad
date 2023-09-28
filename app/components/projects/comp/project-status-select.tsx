
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Ruler, User } from "lucide-react"
import { ProjectStatuses, } from "~/server/database/projects.server"
import { ProjectStatus } from "./project-status"


export interface ProjectStatusSelectProps {
  status: ProjectStatuses
}


export default function ProjectStatusSelect(
  { status }: ProjectStatusSelectProps
) {
  const projectStatuses: ProjectStatuses[] = [
    "active",
    "canceled",
    "completed",
    "inactive",
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="hover:bg-accent">
          <ProjectStatus status={status} size="large" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          <div className="flex items-center gap-x-4">
            <Ruler className="mr-2 h-4 w-4" />
            <p>
              Select Status
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {
            projectStatuses.map((status) => (
              <DropdownMenuItem key={status}>
                <ProjectStatus status={status} size="large" />
              </DropdownMenuItem>
            ))
          }
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>


  )
}