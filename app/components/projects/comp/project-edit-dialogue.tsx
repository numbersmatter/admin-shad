import { useFetcher } from "@remix-run/react"
import { is } from "date-fns/esm/locale"
import { FormEvent, use, useEffect, useRef, useState } from "react"
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
import { useToast } from "~/components/ui/use-toast"
import { cn } from "~/lib/utils"

export function ProjectEditDialogue({
  title, invoice, notes
}: {
  title: string,
  invoice: number,
  notes: string,
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const fetcher = useFetcher<any>();
  const formRef = useRef<HTMLFormElement>(null);
  const formData = fetcher.formData;
  const isFormData = formData !== undefined;
  const isSaving = fetcher.state !== "idle" && isFormData
  const actionData = fetcher.data;
  const success = actionData ? actionData.success : false;

  const handleSaveChanges = (e: FormEvent) => {
    // @ts-ignore
    const formData = new FormData(e.currentTarget);
    if (!formRef.current) return;
    fetcher.submit(formData, { method: "POST" })
  }

  useEffect(() => {
    if (success && !isSaving) {
      console.log("success here")
      toast({ title: "Project Updated", description: "Project details have been updated" });
      setIsDialogOpen(false);
    }

  }, [isSaving, success, toast])


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

          <fieldset disabled={isSaving}>
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
                <input hidden name="_action" value="updateBasic" readOnly />
              </div>
              <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-4 ">
                <Label htmlFor="invoiceAmount" className="sm:text-right">
                  Invoice Amount
                </Label>
                <Input
                  id="invoiceAmount"
                  name="invoiceAmount"
                  defaultValue={invoice}
                  className="col-span-1 sm:col-span-3"
                />
              </div>
              <div className="grid grid-cols-1 gap-2 pt-4 items-center  sm:grid-cols-4 sm:pt-2 sm:gap-4">
                <Label htmlFor="notes" className="sm:text-right">
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
          </fieldset>
        </fetcher.Form>
        <DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
