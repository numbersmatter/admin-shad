import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { intializeWorkSession } from "~/server/auth/auth-work-session.server";
import { getProductFormData, getProductFormField } from "~/server/domains/productDomain.server";

export async function action({ params, request }: ActionFunctionArgs) {
  const { storeId } = await intializeWorkSession(request);

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



export default function RouteName() {
  const { fieldData } = useLoaderData<typeof loader>();
  return (
    <main className="">
      <h1>Product Form Field</h1>
      <pre>{JSON.stringify(fieldData, null, 2)}</pre>
      <Card>
        <CardHeader>
          <CardTitle>
            {fieldData.fieldLabel}
          </CardTitle>
          <CardDescription>
            {fieldData.fieldType}
          </CardDescription>
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
    </main>
  );
}