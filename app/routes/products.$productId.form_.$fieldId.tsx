import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { makeDomainFunction } from "domain-functions";
import { Button } from "react-day-picker";
import { performMutation } from "remix-forms";
import { ButtonDialogField } from "~/components/common/button-dialogue-field";
import { StandardDataTable } from "~/components/common/standard-data-table";
import { ProductFormTextFieldEdit } from "~/components/products/comp/product-form-text-field-edit";
import { productFormSelectOptionColumnsLong, productFormSelectOptionColumnsShort } from "~/components/products/product-form-select-columns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { intializeWorkSession } from "~/server/auth/auth-work-session.server";
import { FieldSettingsData } from "~/server/domains/domain-types";
import { ChangeFieldLabelSchema, DeleteItemSchema, MoveUpDownSchema } from "~/server/domains/product-schemas";
import { addSelectOption, changeFormFieldName, deleteSelectOption, getProductFormData, getProductFormField } from "~/server/domains/productDomain.server";

export async function action({ params, request }: ActionFunctionArgs) {
  const { storeId } = await intializeWorkSession(request);
  const productId = params.productId ?? "undefined";
  const fieldId = params.fieldId ?? "undefined";
  const formData = await request.clone().formData();
  const action = formData.get("_action") ?? undefined;

  const updateFieldMutation = makeDomainFunction(ChangeFieldLabelSchema)(
    async (data) => {
      await changeFormFieldName({
        storeId,
        productId,
        fieldId,
        fieldName: data.fieldLabel,
      })
      return { success: true }
    }
  )
  const moveSelectOptionMutation = makeDomainFunction(MoveUpDownSchema)(
    async (data) => {
      // await moveSelectOption({
      //   storeId,
      //   productId,
      //   fieldId,
      //   optionId: data.optionId,
      //   direction: data.direction,
      // })
      return { success: true }
    }
  )
  const deleteSelectOptionMutation = makeDomainFunction(DeleteItemSchema)(
    async (data) => {
      await deleteSelectOption({
        storeId,
        productId,
        fieldId,
        optionId: data.id,
      })
      return { success: true }
    }
  )
  const addOptionMutation = makeDomainFunction(ChangeFieldLabelSchema)(
    async (data) => {
      await addSelectOption({
        storeId,
        productId,
        fieldId,
        optionName: data.fieldLabel,
      })
      return { success: true }
    }
  )


  if (action === "updateLabel") {
    const result = await performMutation({
      request,
      schema: ChangeFieldLabelSchema,
      mutation: updateFieldMutation,
    })
    if (!result.success) { return json(result, 400) }
    return json({ success: true, message: "Label Updated", errors: {} })
  }

  if (action === "addOption") {
    const result = await performMutation({
      request,
      schema: ChangeFieldLabelSchema,
      mutation: addOptionMutation,
    })
    if (!result.success) { return json(result, 400) }
    return json({ success: true, message: "Label Updated", errors: {} })
  }

  if (action === "deleteSelectOption") {
    const result = await performMutation({
      request,
      schema: DeleteItemSchema,
      mutation: deleteSelectOptionMutation,
    })
    if (!result.success) { return json(result, 400) }
    return json({ success: true, message: "Deleted", errors: {} })
  }

  return json({});
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { storeId } = await intializeWorkSession(request);

  const fieldData = await getProductFormField({
    storeId,
    productId: params.productId ?? "undefined",
    fieldId: params.fieldId ?? "undefined",
  });


  return json({ fieldData });
}



export default function FormFieldId() {
  const { fieldData } = useLoaderData<typeof loader>();

  const textFields = ["textField", "textArea", "emailField"];


  return (
    <main className="">
      <Card>
        <CardHeader>
          <CardTitle>
            {fieldData.fieldLabel}
          </CardTitle>
          <CardDescription>
            {fieldData.fieldType}
          </CardDescription>
          <div className="flex flex-row justify-between">
            <ButtonDialogField
              buttonLabel="Change Label"
              dialogTitle="Change field label"
              dialogDescription="Edit the field"
              inputLabel="Field Label"
              inputId="fieldLabel"
              inputDefaultValue={fieldData.fieldLabel}
              saveLabel="Save"
              _action="updateLabel"
            />
          </div>
        </CardHeader>
        <CardContent>
          {
            textFields.includes(fieldData.fieldType) &&
            <TextFieldData fieldData={fieldData} />
          }
          {
            fieldData.fieldType === "select" &&

            <div className="mt-4 flex flex-col space-y-6">
              <ButtonDialogField
                buttonLabel="Add Option"
                dialogTitle="Add Option"
                dialogDescription="Add an option to the select field"
                inputLabel="Option Label"
                inputId="fieldLabel"
                inputDefaultValue=""
                saveLabel="Save"
                _action="addOption"
              />
              <SelectFieldData fieldData={fieldData} />
            </div>
          }
        </CardContent>
      </Card>
      <pre>{JSON.stringify(fieldData, null, 2)}</pre>
    </main>
  );
}

function SelectFieldData({ fieldData }: { fieldData: FieldSettingsData }) {

  return (
    <StandardDataTable
      data={fieldData.options}
      columns={productFormSelectOptionColumnsLong}
    />
  )
}


function TextFieldData({ fieldData }: { fieldData: FieldSettingsData }) {


  return (
    <>
      <p>
        <span className="font-bold">Field ID:</span> {fieldData.fieldId}
      </p>
      <p>
        <span className="font-bold">Label:</span> {fieldData.fieldLabel}
      </p>
      <p>
        <span className="font-bold">Placeholder:</span> {fieldData.placeholder}
      </p>
      <p>
        <span className="font-bold">Required:</span>
        {fieldData.requiredData.required ? " Yes" : " No"}
      </p>
      <p>
        <span className="font-bold">
          Minimum Length:
        </span> {fieldData.requiredData.min}
      </p>
      <p>
        <span className="font-bold">
          Error Length:
        </span> {fieldData.requiredData.message}
      </p>
    </>
  )
}