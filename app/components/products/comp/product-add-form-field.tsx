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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel } from "~/components/ui/select"
import { Textarea } from "~/components/ui/textarea"

export function ProductAddFormField({
  // buttonLabel,
  // dialogTitle,
  // dialogDescription,
  // inputLabel,
  // inputId,
  // inputDefaultValue,
  // saveLabel,
  // _action,
  // textarea,
}: {
    // buttonLabel: string,
    // dialogTitle: string,
    // dialogDescription: string,
    // inputLabel: string,
    // inputId: string,
    // inputDefaultValue: string,
    // saveLabel: string,
    // _action: string,
    // textarea?: boolean,
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
