import { useState } from "react";
import { ButtonDialogForm } from "~/components/common/button-dialogue-form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";




export function ProductFormTextFieldEdit({
  fieldLabel,
  placeholder,
  requiredData,

}: {
  fieldLabel: string,
  placeholder: string,
  requiredData: {
    required: boolean,
    message: string,
    min: number,
  }

}) {
  const [required, setRequired] = useState(requiredData.required);


  return (
    <ButtonDialogForm
      openButtonLabel="Edit"
      dialogTitle="Edit Product Form Field"
      dialogDescription="Edit the product form field."
      submitButtonLabel="Save Changes"
    >
      <div className="grid grid-cols-2 gap-4 py-3">
        <div className="grid-cols-1 space-y-2 md:grid-cols-4 md:gap-4  items-center ">
          <Label htmlFor="fieldLabel" className="text-right">
            Field Label
          </Label>
          <Input
            id="fieldLabel"
            name="fieldLabel"
            defaultValue={fieldLabel}
            className="col-span-3"
          />
        </div>
        <div className="grid-cols-1 space-y-2 md:grid-cols-4 md:gap-4  items-center ">
          <Label htmlFor="placeholderText" className="text-right">
            Placeholder Text
          </Label>
          <Input
            id="placeholderText"
            name="placeholderText"
            defaultValue={placeholder}
            className="col-span-3"
          />
        </div>
        <div className="col-span-full grid-col-1">
          <h4 className="text-lg underline underline-offset-1 font-semibold">
            Set Required
          </h4>
          <div className="flex items-center space-x-2 py-1">
            <Switch
              id="requiredSwitch"
              name="requiredSwitch"
              checked={required}
              onCheckedChange={setRequired}
            />
            <Label htmlFor="requiredSwitch" className="text-right">
              {required ? "Required" : "Not Required"}
            </Label>
          </div>

        </div>

        <div hidden={!required} className="">
          <div className="grid-cols-1 space-y-2 md:grid-cols-4 md:gap-4  items-center ">
            <Label htmlFor="requiredMessage" className="text-right">
              Required Message
            </Label>
            <Input
              id="requiredMessage"
              name="requiredMessage"
              defaultValue={requiredData.message}
              className="col-span-3"
            />
          </div>
          <div className="grid-cols-1 space-y-2 md:grid-cols-4 md:gap-4  items-center ">
            <Label htmlFor="minLength" className="text-right">
              Minimum Length
            </Label>
            <Input
              id="minLength"
              type="number"
              name="minLength"
              defaultValue={requiredData.min}
              className="col-span-3"
            />
          </div>
        </div>
      </div>
      <input readOnly hidden name="_action" value="update" />
      <input readOnly hidden name="required" value={required ? "true" : "false"} />
      <input readOnly hidden name="fieldType" value={"text"} />
    </ButtonDialogForm>
  )



}