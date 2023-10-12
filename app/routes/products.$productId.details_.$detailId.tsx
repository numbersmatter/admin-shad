import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { makeDomainFunction } from "domain-functions";
import { z } from "zod";
import { ButtonDialogSingle } from "~/components/common/button-dialogue-single";
import { ProductDetailCard } from "~/components/products/comp/product-detail-card";
import { ProductDetailEditDialog } from "~/components/products/comp/product-detail-edit-dialoge";
import { ProductDetailItemCard } from "~/components/products/comp/product-detail-item-card";
import { Button } from "~/components/ui/button";
import { intializeWorkSession } from "~/server/auth/auth-work-session.server";
import { AddDetailSchema, EditDetailBasicSchema } from "~/server/domains/product-schemas";
import { addProductDetailItem, deleteProductDetailItem, getProductEditData, updateProductDetail, updateProductDetailItem } from "~/server/domains/productDomain.server";
import { formAction } from "~/server/form-actions/form-action.server";


const AddItemSchema = z.object({
  value: z.string(),
});

const updateItemSchema = z.object({
  value: z.string(),
  itemId: z.string(),
  _action: z.string(),
});

export async function action({ params, request }: ActionFunctionArgs) {
  const { storeId, uid, session } = await intializeWorkSession(request);
  const productId = params.productId ?? "none";
  const detailId = params.detailId ?? "none";
  const formData = await request.clone().formData();

  const action = formData.get("_action");

  const addDetailItem = makeDomainFunction(AddItemSchema)(async (values) => {
    await addProductDetailItem({
      productId,
      storeId,
      detailId,
      itemValue: values.value,
    });

    return { message: "added", success: true };
  });

  const updateDetail = makeDomainFunction(AddDetailSchema)(async (values) => {
    await updateProductDetail({
      productId,
      storeId,
      detailId,
      detailData: {
        name: values.name,
        type: values.type
      },
    });
    return { message: "saved", success: true };
  });

  const deleteItem = makeDomainFunction(updateItemSchema)(async (values) => {
    await deleteProductDetailItem({
      productId,
      storeId,
      detailId,
      itemId: values.itemId,
    });

    return { message: "deleted" };
  });

  const updateItem = makeDomainFunction(updateItemSchema)(async (values) => {
    await updateProductDetailItem({
      productId,
      storeId,
      detailId,
      itemId: values.itemId,
      itemValue: values.value,
    });

    return { message: "saved", success: true };
  });

  if (action === "updateDetailItem") {
    return formAction({
      request,
      mutation: updateItem,
      schema: updateItemSchema,
    });
  };

  if (action === "addItem") {
    return formAction({
      request,
      mutation: addDetailItem,
      schema: AddItemSchema,
    });
  };

  if (action === "deleteItem") {
    return formAction({
      request,
      mutation: deleteItem,
      schema: updateItemSchema,
    });
  };

  if (action === "updateBasic") {
    return formAction({
      request,
      mutation: updateDetail,
      schema: EditDetailBasicSchema,
    });
  };



  return json({ success: false, message: "Unknown action" });
};



export async function loader({ params, request }: LoaderFunctionArgs) {
  const { storeId, uid, session } = await intializeWorkSession(request);

  const detailId = params.detailId ?? "none";
  const { details } = await getProductEditData({
    storeId,
    productId: params.productId ?? "none",
  });
  console.log("details", details)

  const detail = details.find(d => d.id === detailId);
  if (!detail) {
    throw new Response("Not Found", { status: 404 });
  }

  const backUrl = `/products/${params.productId}/details`;

  return json({ detail, backUrl });
}



export default function ProductDetailId() {
  const { detail, backUrl } = useLoaderData<typeof loader>();
  return (
    <div>
      <ProductDetailCard detail={detail} >
        <div className="flex flex-col justify-start  content-center">
          <ProductDetailEditDialog
            buttonLabel="Edit Detail"
            title="Edit Detail"
            description="Edit this detail"
            name={detail.name}
            detailType={detail.type}
            _action="updateBasic"
          />
        </div>
        <div className="flex flex-col justify-start py-2  content-center gap-4">
          {
            detail.items.map(item => {
              return (
                <ProductDetailItemCard item={item} key={item.id} />
              )
            })
          }
        </div>

      </ProductDetailCard>
    </div>
  );
}