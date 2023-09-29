import { useFetcher } from "@remix-run/react"
import { FormEvent, use, useRef, useState } from "react"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"

export function ProjectEditDialogue({
  title, invoice, notes
}: {
  title: string,
  invoice: number,
  notes: string,
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSaveChanges = (e: FormEvent) => {
    // @ts-ignore
    const formData = new FormData(e.currentTarget);
    if (!formRef.current) return;
    fetcher.submit(formData, { method: "POST" })

  }


  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">Edit Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[750px]">
        <DialogHeader>
          <DialogTitle>Edit Project Details</DialogTitle>
          <DialogDescription>
            Edit the project details. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {/* @ts-ignore */}
        <fetcher.Form onSubmit={handleSaveChanges} method="POST">

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-4 ">
              <Label htmlFor="title" className="sm:text-right">
                Project Title
              </Label>
              <Input
                id="title"
                name="title"
                defaultValue={title}
                className="col-span-1 sm:col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-4 ">
              <Label htmlFor="invoice" className="sm:text-right">
                Invoice Amount
              </Label>
              <Input
                id="invoice"
                name="invoice"
                defaultValue={invoice}
                className="col-span-1 sm:col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 gap-2 pt-4 items-center  sm:grid-cols-4 sm:pt-2 sm:gap-4">
              <Label htmlFor="username" className="sm:text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                name="notes"
                defaultValue={notes}
                className="col-span-3"
              />
            </div>
          </div>
          <Button type="submit">Save changes</Button>
        </fetcher.Form>
        <DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
