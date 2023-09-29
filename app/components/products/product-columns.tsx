import { ColumnDef } from "@tanstack/react-table";
import { ProjectsActionsMenu } from "../projects/comp/project-actions-menu";
import { CheckCircle, XCircleIcon } from "lucide-react";


type ProductRow = {
  id: string;
  name: string;
  availability: boolean;
  description: string;
}



export const productRowTestData: ProductRow[] = [
  {
    id: "1",
    name: "Product 1",
    availability: true,
    description: "This is a description of product 1",
  },
  {
    id: "2",
    name: "Standard Commission in my ususal style but reallylong this time in order to test the wrapping",
    availability: false,
    description: "This is a description of product 2",
  },
  {
    id: "3",
    name: "Comic",
    availability: true,
    description: "This is a description of product 3",
  },
];

function AvailabilityTrue() {
  return (
    <CheckCircle className={`bg-green-700 rounded-full w-7 h-7`} />
  )
}

function AvailabilityFalse() {
  return (
    <XCircleIcon className={`bg-destructive text-destructive-foreground rounded-full w-7 h-7`} />
  )
}

export const productColumnsShort: ColumnDef<ProductRow>[] = [
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col justify-start gap-2">
          <p className="text-primary-foreground text-base font-semibold">
            {row.original.name}
          </p>
          <p className="text-muted-foreground text-sm">
            {row.original.description}
          </p>
        </div>
      )
    },
  },
  {
    header: () => <div className="text-center">Availability</div>,
    accessorKey: "availability",
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          {row.original.availability ? <AvailabilityTrue /> : <AvailabilityFalse />}
        </div>
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
];


export const productColumnsLong: ColumnDef<ProductRow>[] = [
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col justify-start gap-2">
          <p className="text-primary-foreground text-base font-semibold">
            {row.original.name}
          </p>
        </div>
      )
    },
  },
  {
    header: () => <div className="text-center">Description</div>,
    accessorKey: "description",
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <p className="text-muted-foreground">
            {row.original.description}
          </p>
        </div>
      )
    },
  },
  {
    header: () => <div className="text-center">Availability</div>,
    accessorKey: "availability",
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          {row.original.availability ? <AvailabilityTrue /> : <AvailabilityFalse />}
        </div>
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
];






