import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { makeDomainFunction } from "domain-functions";
import { performMutation } from "remix-forms";
import { ButtonDialogSingle } from "~/components/common/button-dialogue-single";
import { ProductDetailEditDialog } from "~/components/products/comp/product-detail-edit-dialoge";
import { ProductDetailList } from "~/components/products/comp/product-details-list";
import { intializeWorkSession } from "~/server/auth/auth-work-session.server";
import { AddDetailSchema } from "~/server/domains/product-schemas";
import { addProductDetail, getProductEditData, } from "~/server/domains/productDomain.server";


export async function action({ params, request }: ActionFunctionArgs) {
  const { storeId, uid, session } = await intializeWorkSession(request);
  const productId = params.productId ?? "none";
  const formData = await request.clone().formData();
  const action = formData.get("_action");


  const mutation = makeDomainFunction(AddDetailSchema)(async (values) => {
    const detailId = await addProductDetail({
      productId,
      storeId,
      detailData: values,
    });

    return detailId;
  });
  const result = await performMutation({
    request,
    mutation,
    schema: AddDetailSchema
  });

  if (!result.success) {
    return json(result);
  }

  return redirect(`/products/${productId}/details/${result.data}`);

}


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
        <div className="flex flex-col justify-start py-2  content-center gap-4">
          <ProductDetailEditDialog
            buttonLabel="Add Detail"
            title="Add Detail"
            description="Edit this detail"
            name={""}
            detailType={"bullet"}
            _action="updateBasic"
          />
        </div>
      </div>
    </main>
  );
}