import { ColumnDef } from "@tanstack/react-table"
import { Button } from "~/components/ui/button"
import { ProjectStatuses } from "~/server/database/projects.server"
import { ProjectsActionsMenu } from "./project-actions-menu"
import { ProjectStatus } from "./project-status"




type ProjectTableRow = {
  id: string,
  title: string,
  completedPoints: number,
  totalPoints: number,
  // points: string,
  amount: number,
  status: ProjectStatuses,
}


export const projectsTestData: ProjectTableRow[] = [
  {
    id: "728ed52f",
    title: "Project 1",
    completedPoints: 100,
    totalPoints: 100,
    amount: 100,
    status: "completed",
  },
  {
    id: "sfewf",
    title: "Ref Sheet furry",
    completedPoints: 30,
    totalPoints: 100,
    amount: 100,
    status: "canceled",
  },
  {
    id: "kisdjmiom",
    title: "Comic Page PMB",
    completedPoints: 50,
    totalPoints: 100,
    amount: 100,
    status: "inactive",
  },
  {
    id: "728egfjdpagijr",
    title: "Commission for Terry who is always asking about it.",
    completedPoints: 20,
    totalPoints: 100,
    amount: 100,
    status: "active",
  },
]


export const projectsColumnsLong: ColumnDef<ProjectTableRow>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: "points",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            className=""
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span className="text-lg font-medium">Points</span>
          </Button>
        </div>

      )
    },
    accessorFn: row => {
      return (
        row.completedPoints / row.totalPoints
      )
    },
    cell: (props) => {
      const completedPoints = props.row.original.completedPoints.toString();
      const totalPoints = props.row.original.totalPoints.toString();

      return (
        <div className="text-center">
          <span className="font-medium">{completedPoints}</span>
          <span className="font-bold"> / </span>
          <span className="text-xs text-muted-foreground">{totalPoints}</span>
        </div>
      )
    }
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <ProjectStatus status={row.original.status} />
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <ProjectsActionsMenu projectId={row.original.id} />
      )
    },
  },

]

export const projectsColumnsShort: ColumnDef<ProjectTableRow>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1">
          <div className="font-medium">{row.original.title}</div>
          <div className="text-xs text-muted-foreground">
            {row.original.completedPoints} / {row.original.totalPoints} points
          </div>
          <div><ProjectStatus status={row.original.status} /></div>
        </div>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <ProjectsActionsMenu projectId={row.original.id} />
      )
    },
  },
]


