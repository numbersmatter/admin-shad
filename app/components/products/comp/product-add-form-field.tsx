import { useFetcher } from "@remix-run/react"
import { is } from "date-fns/locale"
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel } from "~/components/ui/select"
import { Textarea } from "~/components/ui/textarea"
import { toast } from "~/components/ui/use-toast"
import { action } from "~/routes/_index"
import { StandardAPIResponse } from "~/server/domains/api-interfaces"



export function ProductAddFormField({
}: {
  }) {
  const fetcher = useFetcher<StandardAPIResponse>();
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);

  const formData = fetcher.formData;
  const isFormData = formData !== undefined;
  const isSaving = fetcher.state !== "idle" && isFormData
  const actionData = fetcher.data;
  const success = actionData ? actionData.success : false;
  const isError = actionData ? !actionData.success : false;


  useEffect(() => {
    if (isError) {
      toast({ title: "Error Occurred", description: "Error Occurred" });
    }

  }, [isSaving, success])



  const handleSaveChanges = (e: FormEvent) => {
    // @ts-ignore
    const formData = new FormData(e.currentTarget);
    if (!formRef.current) return;
    fetcher.submit(formData, { method: "POST" })
  }




  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Add Field</Button>
      </DialogTrigger>
      <DialogContent className="rounded-none sm:rounded-md sm:max-w-[525px]">
        <fetcher.Form method="POST" ref={formRef} onSubmit={handleSaveChanges}>
          <DialogHeader>
            <DialogTitle>Add Form Field</DialogTitle>
            <DialogDescription>
              Add form field
            </DialogDescription>
          </DialogHeader>
          {
            isError &&
            <div
              className="mx-3 my-3 px-2 py-2 rounded-lg border border-red-600 bg-red-300 text-red-700"
            >
              <h5>Errors</h5>
            </div>
          }
          <div className="grid gap-4 py-4">
            <div className="grid-cols-1 space-y-2 md:grid-cols-4 md:gap-4  items-center ">
              <Label htmlFor="fieldLabel" className="text-right">
                field label
              </Label>
              <Input
                id={"fieldLabel"}
                name="fieldLabel"
                defaultValue={""}
                className="col-span-3"
              />
              {
                isError &&
                <div className="col-span-full text-red-600">
                  {actionData?.errors?.fieldLabel}
                </div>
              }


            </div>
            <div className="grid-cols-1 space-y-2 md:grid-cols-4 md:gap-4  items-center ">


              <Select name="fieldType">
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Field Types</SelectLabel>
                    <SelectItem value="textField">Text Field</SelectItem>
                    <SelectItem value="textArea">Text Areas</SelectItem>
                    <SelectItem value="select">Select</SelectItem>
                    <SelectItem value="imageUpload">Image Upload</SelectItem>
                    <SelectItem value="email">Email Field</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {
              isError &&
              <div className="col-span-full text-red-600">
                {actionData?.errors?.fieldType}
              </div>
            }

          </div>
          <DialogFooter>
            <input readOnly hidden name="_action" value={"addField"} />
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  )
}
