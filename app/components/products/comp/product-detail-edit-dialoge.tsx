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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "~/components/ui/select"
import { useToast } from "~/components/ui/use-toast"

export function ProductDetailEditDialog({
  name,
  detailType,
  buttonLabel,
  title,
  description,
  submitLabel,
  _action,
}: {
  name: string,
  buttonLabel: string,
  title: string,
  description: string,
  detailType: "bullet" | "paragraph",
  submitLabel?: string,
  _action: string,
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
      toast({ title: "Detail Updated", description: "" });
      setIsDialogOpen(false);
    }

  }, [isSaving, success, toast])


  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">{buttonLabel}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[750px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        {/* @ts-ignore */}
        <fetcher.Form onSubmit={handleSaveChanges} method="POST">

          <fieldset disabled={isSaving}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-4 ">
                <Label htmlFor="name" className="sm:text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={name}
                  className="col-span-1 sm:col-span-3"
                />
                <input hidden name="_action" value={_action} readOnly />
              </div>
              <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-4 ">
                <Label htmlFor="" className="sm:text-right">
                  Detail Type
                </Label>
                <Select name="type" defaultValue={detailType} >
                  <SelectTrigger className="w-[180px]" >
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>types</SelectLabel>
                      <SelectItem value="bullet">Bulletpoint</SelectItem>
                      <SelectItem value="paragraph">Paragraph</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

              </div>
            </div>
            <Button type="submit">{submitLabel ? submitLabel : "Save"}</Button>
          </fieldset>
        </fetcher.Form>
        <DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
