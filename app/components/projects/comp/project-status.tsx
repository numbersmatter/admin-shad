import { cn } from "~/lib/utils";
import { ProjectStatuses } from "~/server/database/projects.server";



export function ProjectStatus({
  status, size = "small"
}: {
  status: ProjectStatuses,
  size?: "small" | "large"
}) {
  const statusMap: Record<ProjectStatuses, string> = {
    active: "Active",
    completed: "Completed",
    inactive: "Paused",
    canceled: "Canceled",
  }
  const statusColorMap: Record<ProjectStatuses, string> = {
    active: "bg-green-400/10 text-green-400 ring-green-400/20",
    completed: "bg-green-400/10 text-green-400 ring-green-400/20",
    inactive: "bg-yellow-400/10 text-yellow-400 ring-yellow-400/20",
    canceled: "bg-red-400/10 text-red-400 ring-red-400/20",
  }

  const smallStyle = "px-2 py-1 text-xs font-medium"
  const largeStyle = "px-4 py-2 text-xl font-semibold"

  return (
    <span
      className={cn(
        statusColorMap[status],
        size === "small" ? smallStyle : largeStyle,
        "inline-flex items-center rounded-md ring-1 ring-inset"
      )}
    >
      {statusMap[status]}
    </span>
  )


}