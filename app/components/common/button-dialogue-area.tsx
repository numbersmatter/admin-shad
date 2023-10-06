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
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "../ui/textarea"
import { toast } from "../ui/use-toast"

export function ButtonDialogArea({
  buttonLabel,
  dialogTitle,
  dialogDescription,
  inputLabel,
  inputId,
  inputDefaultValue,
  saveLabel,
  _action,
}: {
  buttonLabel: string,
  dialogTitle: string,
  dialogDescription: string,
  inputLabel: string,
  inputId: string,
  inputDefaultValue: string,
  saveLabel: string,
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
      toast({ title: "Updated Saved", description: "" });
      setOpen(false);
    }

  }, [isSaving, success])




  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">{buttonLabel}</Button>
      </DialogTrigger>
      <DialogContent className="rounded-none sm:rounded-md sm:max-w-[525px]">
        <fetcher.Form method="POST" ref={formRef} onSubmit={handleSaveChanges}>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>
              {dialogDescription}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid-cols-1 space-y-2 md:grid-cols-4 md:gap-4  items-center ">
              <Label htmlFor="name" className="text-right">
                {inputLabel}
              </Label>
              <Textarea
                id={inputId}
                name={inputId}
                defaultValue={inputDefaultValue}
                className="col-span-3"
              />
              <input readOnly hidden name="_action" value={_action} />
            </div>

          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>

  )
}
