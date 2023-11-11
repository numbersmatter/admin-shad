import { ColumnDef } from "@tanstack/react-table";
import { ArrowBigDown, ArrowBigUp, CheckCircle, XCircleIcon } from "lucide-react";
import { ProductActionsMenu } from "./comp/product-action-menu";
import { useFetcher } from "@remix-run/react";
import { ProductFormActionMenu } from "./comp/product-form-action-menu";


type ProductFormRow = {
  fieldId: string;
  label: string;
  type: string;
}


export const productFormTestData: ProductFormRow[] = [
  {
    fieldId: "1",
    label: "Type of Background",
    type: "dropdown",
  },
  {
    fieldId: "2",
    label: "Number of Characters",
    type: "number",
  },
];

function MoveComp(props: { direction: "up" | "down", id: string }) {
  const fetcher = useFetcher()

  const status = fetcher.state

  const isFetching = status !== "idle"
  return (
    <div className="flex justify-center">
      <fetcher.Form method="POST"  >
        <input readOnly type="hidden" name="_action" value="moveOption" />
        <input readOnly type="hidden" name="optionId" value={props.id} />
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



export const productFormColLong: ColumnDef<ProductFormRow>[] = [
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col justify-start gap-2">
          <p className="text-primary-foreground text-base font-semibold">
            {row.original.label}
          </p>
          <p className="text-secondary-foreground text-base">
            {row.original.type}
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
          <MoveComp direction="up" id={row.original.fieldId} />
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
          <MoveComp direction="down" id={row.original.fieldId} />
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <ProductFormActionMenu
          productId={row.original.fieldId}
          fieldId={row.original.fieldId}
        // optionId={row.original.fieldId} 
        />
      )
    },
  },
];


