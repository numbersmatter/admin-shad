


import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { isRouteErrorResponse, useLoaderData, useParams, useRouteError } from "@remix-run/react";
import { ProductBasicCard } from "~/components/products/comp/product-basic-card";
import ProductDescriptionList from "~/components/products/comp/product-description-list";
import { ProductSecondaryNav } from "~/components/products/comp/product-secondary-nav";
import { ProductTabs } from "~/components/products/comp/product-tabs";
import { intializeWorkSession } from "~/server/auth/auth-work-session.server";
import { ProductBasicsSchema } from "~/server/domains/product-schemas";
import { getProductEditData, updateProductBasicFieldMutation } from "~/server/domains/productDomain.server";
import { formAction } from "~/server/form-actions/form-action.server";

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { storeId, uid, session } = await intializeWorkSession(request);
  const formData = await request.clone().formData();

  const productId = params.productId ?? "none";
  const action = formData.get("_action");

  switch (action) {
    case "updateBasic":
      return formAction({
        request,
        mutation: updateProductBasicFieldMutation({ storeId, productId }),
        schema: ProductBasicsSchema.partial(),
      })

    default:
      return json({ status: "ok" }, { status: 200 });
  }
};


export async function loader({ params, request }: LoaderFunctionArgs) {
  const { storeId, uid, session } = await intializeWorkSession(request);

  const { productBasic } = await getProductEditData({ storeId, productId: params.productId ?? "none" });

  return json({ productBasic });
}



export default function ProductIdIndexRoute() {
  const { productId } = useParams();
  const { productBasic } = useLoaderData<typeof loader>();


  return (
    <main className="">
      <ProductDescriptionList
        productBasic={productBasic}
      />
    </main>
  )
}