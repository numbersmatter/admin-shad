import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useToast } from "~/components/ui/use-toast";
import { useFetcher } from "@remix-run/react";
import { Textarea } from "~/components/ui/textarea";
import { SelectTaskLevel } from "./select-task-level";


export function AddTaskDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const fetcher = useFetcher<any>();
  const formRef = useRef<HTMLFormElement>(null);
  const formData = fetcher.formData;
  const isFormData = formData !== undefined;
  const isSaving = fetcher.state !== "idle" && isFormData
  const actionData = fetcher.data;
  const success = actionData ? actionData.success : false;
  const isError = actionData?.errors ? true : false;

  const errorReply: { [key: string]: string[] } = actionData?.errors ? actionData.errors : {};

  const errors: { key: string, messages: string[] }[] = Object.entries(errorReply).map(([key, messages]) => ({ key, messages }))

  const handleSaveChanges = (e: FormEvent) => {
    // @ts-ignore
    const formData = new FormData(e.currentTarget);
    if (!formRef.current) return;
    fetcher.submit(formData, { method: "POST" })
  }
  const taskTitle = actionData?.taskTitle ?? "";


  useEffect(() => {
    if (success && !isSaving) {
      toast({ title: "Task Added", description: `Task ${taskTitle} was added.` });
      setIsDialogOpen(false);
    }

  }, [isSaving, success, toast, taskTitle])


  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">Add Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[750px]">
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
          <DialogDescription>
            Add a new task to the project.
          </DialogDescription>
        </DialogHeader>
        {/* @ts-ignore */}
        {
          isError &&
          <div className="w-full px-4">
            <ErrorMessage errors={errors} />
          </div>
        }
        <fetcher.Form onSubmit={handleSaveChanges} method="POST">
          <fieldset disabled={isSaving}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-4 ">
                <Label htmlFor="title" className="sm:text-right">
                  Task Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={""}
                  className="col-span-1 sm:col-span-3"
                />
                <input hidden name="_action" value="addTask" readOnly />
              </div>
              <div className="grid grid-cols-1 gap-2 pt-4 items-center  sm:grid-cols-4 sm:pt-2 sm:gap-4">
                <Label htmlFor="notes" className="sm:text-right">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  defaultValue={""}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-1 gap-2 pt-4 items-center  sm:grid-cols-4 sm:pt-2 sm:gap-4">
                <Label htmlFor="notes" className="sm:text-right">
                  Task Points
                </Label>
                <SelectTaskLevel />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Add Task</Button>
            </div>
          </fieldset>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  )
}


function ErrorMessage({
  errors,
}: {
  errors: { key: string, messages: string[] }[];
}) {
  return (
    <div className="rounded-lg w-full border border-destructive-foreground bg-destructive px-3 py-2">
      <h5>
        Errors on form:
      </h5>
      {errors.map((error) => (
        <div key={error.key}>
          <p>{error.key}:</p>
          <ul>
            {error.messages.map((message, i) => (
              <li key={i}>{message}</li>
            ))
            }
          </ul>
        </div>
      ))
      }
    </div>
  )
}
