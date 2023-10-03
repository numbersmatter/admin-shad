import { useFetcher } from "@remix-run/react"
import { Checkbox } from "~/components/ui/checkbox";



export function TaskCheckBox({
  taskId,
  checked,
}: {
  taskId: string,
  checked: boolean,
}) {
  const fetcher = useFetcher();
  const submit = fetcher.submit;

  const isFetching = fetcher.state !== "idle";

  const handleCheckedChange = (toggleTo: boolean) => {
    submit({
      taskId,
      toggleTo,
      _action: "toogleTask",
    }, { method: "POST" })

  };

  return (
    <fetcher.Form method="POST">
      <Checkbox
        id={taskId}
        name="completed"
        defaultChecked={checked}
        disabled={isFetching}
        onCheckedChange={(checked) => {
          if (checked === "indeterminate") return;
          handleCheckedChange(checked)
        }}
      />
    </fetcher.Form>
  )

}