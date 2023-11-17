import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { makeDomainFunction } from "domain-functions";
import { performMutation } from "remix-forms";
import { StandardDataTable } from "~/components/common/standard-data-table";
import { ProductAddFormField } from "~/components/products/comp/product-add-form-field";
import { productFormColLong } from "~/components/products/product-form-columns";
import { Button } from "~/components/ui/button";
import { intializeWorkSession } from "~/server/auth/auth-work-session.server";
import { AddFormFieldSchema } from "~/server/domains/product-schemas";
import { addProductFormField, getProductFormData } from "~/server/domains/productDomain.server";

export async function action({ params, request }: ActionFunctionArgs) {
  const { storeId } = await intializeWorkSession(request);
  const formData = await request.clone().formData();
  const action = formData.get("_action");

  const productId = params.productId ?? "none";

  const addFieldMutation = makeDomainFunction(AddFormFieldSchema)(
    async (data) => {
      const newFieldId = await addProductFormField({
        storeId,
        productId,
        fieldData: {
          label: data.fieldLabel,
          fieldType: data.fieldType,
        }
      })
      return { newFieldId }
    }
  )

  switch (action) {
    case "addField":
      const result = await performMutation({
        request,
        schema: AddFormFieldSchema,
        mutation: addFieldMutation,
      })
      if (!result.success) { return json(result, 400) }
      return redirect(`/products/${productId}/form/${result.data.newFieldId}`);
    default:
      break;
  }

  return json({});
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { storeId } = await intializeWorkSession(request);
  const productId = params.productId ?? "none";

  const formData = await getProductFormData({ storeId, productId });

  const fieldRows = formData.formFields.map((field) => {
    return {
      fieldId: field.fieldId,
      label: field.fieldLabel,
      type: field.fieldType,
    }
  })

  return json({ fieldRows });
}



export default function RouteName() {
  const { fieldRows } = useLoaderData<typeof loader>();
  return (
    <main className="">
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold">Product Form</h1>
        <ProductAddFormField />
      </div>
      <StandardDataTable
        columns={productFormColLong}
        data={fieldRows}
      />

    </main>
  );
}