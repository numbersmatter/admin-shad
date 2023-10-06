import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ProductDetailList } from "~/components/products/comp/product-details-list";
import { intializeWorkSession } from "~/server/auth/auth-work-session.server";
import { getProductEditData } from "~/server/domains/productDomain.server";




export async function loader({ params, request }: LoaderFunctionArgs) {
  const { storeId, uid, session } = await intializeWorkSession(request);

  const { details } = await getProductEditData({
    storeId,
    productId: params.productId ?? "none",
  });

  return json({ details });
}


export default function ProductIdDetailsRoute() {
  const { details } = useLoaderData<typeof loader>();

  return (
    <main className=" ">
      <h3 className="text-primary-foreground text-2xl my-3 text-center" >
        Product Details
      </h3>
      <div className=" mx-auto max-w-4xl">
        <ProductDetailList details={details} />
      </div>
    </main>
  );
}