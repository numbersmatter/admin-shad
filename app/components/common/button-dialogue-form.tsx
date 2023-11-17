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
import { toast } from "../ui/use-toast";

interface APIResponse {
  success: boolean,
  message: string,
  data: any,
}

export function ButtonDialogForm({
  openButtonLabel,
  dialogTitle,
  dialogDescription,
  submitButtonLabel,
  children,
}: {
  children?: React.ReactNode,
  openButtonLabel: string,
  dialogTitle: string,
  dialogDescription: string,
  submitButtonLabel: string,
}) {
  const fetcher = useFetcher<APIResponse>();
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
        <Button variant="secondary">{openButtonLabel}</Button>
      </DialogTrigger>
      <DialogContent className="rounded-none sm:rounded-md sm:max-w-[525px]">
        <fetcher.Form method="POST" ref={formRef} onSubmit={handleSaveChanges}>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>
              {dialogDescription}
            </DialogDescription>
          </DialogHeader>
          {children}
          <DialogFooter>
            <Button type="submit">{submitButtonLabel}</Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  )
}
