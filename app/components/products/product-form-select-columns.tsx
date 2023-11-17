import { useFetcher } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { ProductFormSelectFieldActionMenu } from "./comp/product-form-select-field-action";

interface SelectOptionRow {
  value: string;
  name: string;
}

export const productFormSelectOptionColumnsShort: ColumnDef<SelectOptionRow>[] = [
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
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     return (
  //       <ProductOptionActionMenu productId={row.original.productId} optionId={row.original.optionId} />
  //     )
  //   },
  // },
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


export const productFormSelectOptionColumnsLong: ColumnDef<SelectOptionRow>[] = [
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
          <MoveComp direction="up" optionId={row.original.value} />
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
          <MoveComp direction="down" optionId={row.original.value} />
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <ProductFormSelectFieldActionMenu />
      )
    },
  },
];
