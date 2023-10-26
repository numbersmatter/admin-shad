import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { StandardDataTable } from "~/components/common/standard-data-table";
import { productFormColLong } from "~/components/products/product-form-columns";
import { intializeWorkSession } from "~/server/auth/auth-work-session.server";
import { getProductFormData } from "~/server/domains/productDomain.server";

export async function action({ params, request }: ActionFunctionArgs) {
  const { storeId } = await intializeWorkSession(request);

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
      <h1>Product Form</h1>
      <StandardDataTable
        columns={productFormColLong}
        data={fieldRows}
      />

    </main>
  );
}