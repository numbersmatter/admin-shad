import { ColumnDef } from "@tanstack/react-table";
import { ArrowBigDown, ArrowBigUp, CheckCircle, XCircleIcon } from "lucide-react";
import { ProductActionsMenu } from "./comp/product-action-menu";
import { useFetcher } from "@remix-run/react";
import { ProductOptionActionMenu } from "./comp/product-option-action-menu";
import { ProductOptionChoiceActionMenu } from "./comp/product-option-choice-action-menu";
import { ro } from "date-fns/locale";


type ProductOptionChoiceRow = {
  choiceId: string;
  optionId: string;
  name: string;
  description: string;
  priceRange: string;
}



export const productOptionChoiceTestData: ProductOptionChoiceRow[] = [
  {
    optionId: "1",
    choiceId: "1",
    name: "Complex Consulting",
    priceRange: "$50-$70",
    description: "Type of Background you would like",
  },
  {
    optionId: "2",
    choiceId: "2",
    name: "Simple Consulting",
    priceRange: "$50-$70",
    description: "Type of Background you would like",
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

export const productOptionChoicesColumnsShort: ColumnDef<ProductOptionChoiceRow>[] = [
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
        <ProductOptionActionMenu productId={"test"} optionId={row.original.optionId} />
      )
    },
  },
];

function MoveComp(props: { direction: "up" | "down", choiceId: string }) {
  const fetcher = useFetcher()

  const status = fetcher.state

  const isFetching = status !== "idle"
  return (
    <div className="flex justify-center">
      <fetcher.Form method="POST"  >
        <input readOnly type="hidden" name="_action" value="moveOptionChoice" />
        <input readOnly type="hidden" name="choiceId" value={props.choiceId} />
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


export const productOptionChoicesColumnsLong: ColumnDef<ProductOptionChoiceRow>[] = [
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
          <MoveComp direction="up" choiceId={row.original.choiceId} />
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
          <MoveComp direction="down" choiceId={row.original.choiceId} />
        </div>
      )
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      return (
        <ProductOptionChoiceActionMenu
          choiceData={
            {
              choiceName: row.original.name,
              priceRange: row.original.priceRange,
              description: row.original.description,
            }
          }
          choiceId={row.original.choiceId}
        />
      )
    },
  },
];






