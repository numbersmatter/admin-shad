
import { DataTable } from "./comp/project-table"
import { columns } from "./comp/columns"






const data = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "728ed5",
    amount: 100,
    status: "pending",
    email: "a@example.com",
  },
  {
    id: "daff",
    amount: 100,
    status: "pending",
    email: "z@example.com",
  },
  // ...
]


export function ProjectsList() {

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex  flex-col items-center justify-between space-y-2 md:flex-row">
        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
        <div className="flex items-center space-x-2">
        </div>
      </div>
      {/* @ts-ignore */}
      <DataTable columns={columns} data={data} />

    </div>
  )
}