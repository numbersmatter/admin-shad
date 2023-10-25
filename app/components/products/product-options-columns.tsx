import { ColumnDef } from "@tanstack/react-table";
import { ArrowBigDown, ArrowBigUp, CheckCircle, XCircleIcon } from "lucide-react";
import { ProductActionsMenu } from "./comp/product-action-menu";
import { useFetcher } from "@remix-run/react";
import { ProductOptionActionMenu } from "./comp/product-option-action-menu";


type ProductOptionRow = {
  productId: string;
  optionId: string;
  name: string;
}



export const productOptionTestData: ProductOptionRow[] = [
  {
    productId: "1",
    optionId: "1",
    name: "Type of Background",
    // description: "Type of Background you would like",
  },
  {
    productId: "2",
    optionId: "2",
    name: "Number of Characters",
    // description: "Number of Characters",
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

export const productOptionColumnsShort: ColumnDef<ProductOptionRow>[] = [
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
    id: "actions",
    cell: ({ row }) => {
      return (
        <ProductOptionActionMenu productId={row.original.productId} optionId={row.original.optionId} />
      )
    },
  },
];

function MoveComp(props: { direction: "up" | "down", optionId: string }) {
  const fetcher = useFetcher()

  const status = fetcher.state

  const isFetching = status !== "idle"
  return (
    <div className="flex justify-center">
      <fetcher.Form method="POST"  >
        <input readOnly type="hidden" name="_action" value="moveOption" />
        <input readOnly type="hidden" name="optionId" value={props.optionId} />
        <input readOnly type="hidden" name="direction" value={props.direction} />
        <button disabled={isFetching} type="submit" className="text-muted-foreground">
          {
            props.direction === "up" ? <ArrowBigUp className="" /> : <ArrowBigDown className="" />
          }
        </button>
      </fetcher.Form>
    </div>
  )
}


export const productOptionColumnsLong: ColumnDef<ProductOptionRow>[] = [
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
    header: () => <div className="text-center">Move Up</div>,
    id: "moveUp",
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <MoveComp direction="up" optionId={row.original.optionId} />
        </div>
      )
    },
  },
  {
    id: "moveDown",
    header: () => <div className="text-center">Move Down</div>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <MoveComp direction="down" optionId={row.original.optionId} />
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <ProductOptionActionMenu productId={row.original.productId} optionId={row.original.optionId} />
      )
    },
  },
];






