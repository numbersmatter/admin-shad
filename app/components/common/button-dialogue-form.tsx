import { useFetcher } from "@remix-run/react"
import { FormEvent, useRef, useState } from "react"
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

export function ButtonDialogForm({
  buttonLabel,
  dialogTitle,
  dialogDescription,
  inputLabel,
  inputId,
  inputDefaultValue,
  saveLabel,
  _action,
  textarea,
}: {
  buttonLabel: string,
  dialogTitle: string,
  dialogDescription: string,
  inputLabel: string,
  inputId: string,
  inputDefaultValue: string,
  saveLabel: string,
  _action: string,
  textarea?: boolean,
}) {
  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);

  const handleSaveChanges = (e: FormEvent) => {
    // @ts-ignore
    const formData = new FormData(e.currentTarget);
    if (!formRef.current) return;
    fetcher.submit(formData, { method: "POST" })
  }




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
              {
                textarea ?
                  <Textarea
                    id={inputId}
                    name={inputId}
                    defaultValue={inputDefaultValue}
                    className="col-span-3"
                  />
                  :
                  <Input
                    id={inputId}
                    name="value"
                    defaultValue={inputDefaultValue}
                    className="col-span-3"
                  />
              }
              <input readOnly hidden name="_action" value={_action} />
              <input readOnly hidden name="inputId" value={inputId} />
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
