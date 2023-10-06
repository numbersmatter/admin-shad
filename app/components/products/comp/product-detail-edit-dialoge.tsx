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
import { Textarea } from "~/components/ui/textarea"
import { useToast } from "~/components/ui/use-toast"

export function ProductDetailEditDialog({
  name, detailType
}: {
  name: string,
  detailType: "bullet" | "paragraph",
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
        <Button type="button" variant="outline">Edit Detail</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[750px]">
        <DialogHeader>
          <DialogTitle>Edit Detail</DialogTitle>
          <DialogDescription>
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
                <input hidden name="_action" value="updateBasic" readOnly />
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
            <Button type="submit">Save changes</Button>
          </fieldset>
        </fetcher.Form>
        <DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
