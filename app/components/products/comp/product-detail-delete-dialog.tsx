import { useFetcher } from "@remix-run/react"
import { FormEvent, useEffect, useRef, useState } from "react"
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
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { toast } from "~/components/ui/use-toast"

export function ProductDetailDeleteDialog({
  _action,
}: {
  _action: string,
}) {
  const fetcher = useFetcher<any>();
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
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
      toast({ title: "Detail Deleted", description: "" });
      setOpen(false);
    }
  }, [isSaving, success])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Delete</Button>
      </DialogTrigger>
      <DialogContent className="rounded-none sm:rounded-md sm:max-w-[525px]">
        <fetcher.Form method="POST" ref={formRef} onSubmit={handleSaveChanges}>
          <DialogHeader>
            <DialogTitle>Add Item</DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid-cols-1 space-y-2 md:grid-cols-4 md:gap-4  items-center ">
              <Label htmlFor="name" className="text-right">
                Detail Item
              </Label>

              <input readOnly hidden name="_action" value={_action} />
            </div>
          </div>
          <DialogFooter>
            <div className="flex justify-between">
              <div>


              </div>

              <div>

                <Button type="submit">Delete Detail</Button>
              </div>
            </div>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  )
}
