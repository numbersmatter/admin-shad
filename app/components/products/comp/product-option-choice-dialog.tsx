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
import { toast } from "~/components/ui/use-toast"

export function ProductOptionChoice({
  choiceData,
  _action,
  openLabel,
  submitLabel,
  choiceId,
}: {
  openLabel: string,
  submitLabel: string,
  choiceData: {
    choiceName: string,
    priceRange: string,
    description: string,
  },
  _action: string,
  choiceId: string,
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
        <Button variant="secondary">{openLabel}</Button>
      </DialogTrigger>
      <DialogContent className="rounded-none sm:rounded-md sm:max-w-[525px]">
        <fetcher.Form method="POST" ref={formRef} onSubmit={handleSaveChanges}>
          <DialogHeader>
            <DialogTitle>
              Add Option Choice
            </DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid-cols-1 space-y-2 md:grid-cols-4 md:gap-4  items-center ">
              <Label htmlFor="name" className="text-right">
                Choice Name
              </Label>
              <Input
                id={"name"}
                name={"name"}
                defaultValue={choiceData.choiceName}
                className="col-span-3"
              />
            </div>
            <div className="grid-cols-1 space-y-2 md:grid-cols-4 md:gap-4  items-center ">
              <Label htmlFor="priceRange" className="text-right">
                Price Range
              </Label>
              <Input
                id={"priceRange"}
                name={"priceRange"}
                defaultValue={choiceData.priceRange}
                className="col-span-3"
              />
            </div>
            <div className="grid-cols-1 space-y-2 md:grid-cols-4 md:gap-4  items-center ">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id={"description"}
                name={"description"}
                defaultValue={choiceData.description}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <div className="flex justify-between">
              <div>


              </div>

              <div>
                <input readOnly hidden name="_action" value={_action} />
                <input readOnly hidden name="choiceId" value={choiceId} />

                <Button type="submit">{submitLabel}</Button>
              </div>
            </div>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  )
}
