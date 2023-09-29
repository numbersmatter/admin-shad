import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "~/components/ui/checkbox";
import { ProjectTask } from "~/server/database/projects.server";
import { TaskCheckBox } from "./task-checkbox";



export const projectTaskTestData: ProjectTask[] = [
  {
    id: "sfewf",
    title: "Rough Sketch",
    taskPoints: 3,
    completed: true,
  },
  {
    id: "kisdjmiom",
    title: "Rough Sketch Confirmation",
    taskPoints: 1,
    completed: true,
  },
  {
    id: "728egfjdpagijr",
    title: "Detailed Sketch",
    taskPoints: 3,
    completed: false,
  },
  {
    id: "728egf",
    title: "Detailed Sketch Confirmation",
    taskPoints: 1,
    completed: false,
  },
  {
    id: "dafesfs",
    title: "Linework",
    taskPoints: 2,
    completed: false,
  },
  {
    id: "wjfrwajgr",
    title: "Flat Color",
    taskPoints: 2,
    completed: false,
  },
  {
    id: "wneenfa",
    title: "Shading & FX",
    taskPoints: 2,
    completed: false,
  },
  {
    id: "jgfdkbjd",
    title: "Final Confirmation",
    taskPoints: 1,
    completed: false,
  },
]

export const projectTaskColumnsShort: ColumnDef<ProjectTask>[] = [
  {
    accessorKey: "title",
    header: "Task",
    cell: ({ row }) => {
      return (
        <div className="">
          <p className="text-sm font-semibold">
            {row.original.title}
          </p>
          <p>
            {row.original.taskPoints} Points
          </p>
        </div>
      )
    }
  },
  {
    id: "checked",
    header: () => <div className="text-center">Completed</div>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <TaskCheckBox
            taskId={row.original.id}
            checked={row.original.completed}
          />
        </div>
      )

    }
  },
]

export const projectTaskColumnsLong: ColumnDef<ProjectTask>[] = [
  {
    accessorKey: "title",
    header: "Task",
    cell: ({ row }) => {
      return (
        <div className="">
          <p className="text-sm font-semibold">
            {row.original.title}
          </p>
        </div>
      )
    }
  },
  {
    accessorKey: "taskPoints",
    header: () => <div className="text-center">Points</div>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <span className="text-sm font-semibold">
            {row.original.taskPoints}
          </span>
        </div>
      )
    }
  },
  {
    id: "checked",
    header: () => <div className="text-center ">Completed</div>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <TaskCheckBox
            taskId={row.original.id}
            checked={row.original.completed}
          />
        </div>
      )

    }
  },

]



