import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { makeDomainFunction } from "domain-functions";
import { ProductFormTextFieldEdit } from "~/components/products/comp/product-form-text-field-edit";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { intializeWorkSession } from "~/server/auth/auth-work-session.server";
import { getProductFormData, getProductFormField } from "~/server/domains/productDomain.server";

export async function action({ params, request }: ActionFunctionArgs) {
  const { storeId } = await intializeWorkSession(request);
  const productId = params.productId ?? "undefined";
  const fieldId = params.fieldId ?? "undefined";
  const formData = await request.clone().formData();
  const action = formData.get("_action") ?? undefined;

  const updateFieldMutation = makeDomainFunction()(
    async (data) => {

    }
  )


  if (action === "update") {

    return redirect(`/products/${productId}/form`);
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
            <ProductFormTextFieldEdit
              fieldLabel={fieldData.fieldLabel}
              placeholder={fieldData.placeholder}
              requiredData={fieldData.requiredData}
            />
          </div>
        </CardHeader>
        <CardContent>
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
          <div className="py-2">

            <h4 className="text-lg underline underline-offset-1 font-semibold">
              Options
            </h4>
            <ul>
              {fieldData.options.map((option, i) => (
                <li key={i}>
                  <span className="font-bold">{option.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
      <pre>{JSON.stringify(fieldData, null, 2)}</pre>
    </main>
  );
}