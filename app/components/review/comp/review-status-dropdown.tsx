import { useState } from "react"
import { Button } from "~/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"

export type ReviewStatus =
  | "pending"
  | "hold"
  | "accepted"
  | "declined"
  | "unset"
  | "review";

interface StatusOption {
  title: string;
  description: string;
  value: ReviewStatus;
}


const statusOptions: StatusOption[] = [
  {
    title: 'Needs Review',
    description: 'Status has not been determined.',
    value: "review"
  },
  { title: 'Hold', description: "It's a solid maybe", value: "hold" },
  { title: 'Accepted', description: "We are doing IT!", value: "accepted" },
  { title: 'Declined', description: "This idea is not for me at the moment", value: "declined" },
]

export default function ReviewStatusDropDown({
  reviewStatus,
}: {
  reviewStatus: ReviewStatus;
}) {
  const [status, setStatus] = useState<ReviewStatus>(reviewStatus)

  const selectedText = statusOptions.find((option) => option.value === status)?.title ?? "Unset Status";

  const statuses = {
    pending: 'text-yellow-500 bg-yellow-100/10 hover:bg-yellow-100/40',
    accepted: 'text-green-400 bg-green-400/10',
    declined: 'text-rose-400 bg-rose-400/10',
    hold: 'text-yellow-400 bg-blue-400/10',
    unset: 'text-gray-400 bg-gray-400/10',
    review: 'text-yellow-500 bg-yellow-100/10',
  }


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="link" className={`${statuses[status]}  min-w-[150px]`}>
          {selectedText}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="">
        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* @ts-ignore */}
        <DropdownMenuRadioGroup value={status} onValueChange={setStatus}>
          {
            statusOptions.map((option) => (
              <DropdownMenuRadioItem
                key={option.title}
                value={option.value}
              >
                {option.title}
              </DropdownMenuRadioItem>
            ))
          }
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
