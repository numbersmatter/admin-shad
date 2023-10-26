import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { StandardDataTable } from "~/components/common/standard-data-table";
import { ProductOptionCard } from "~/components/products/comp/product-option-card";
import { productOptionChoicesColumnsLong } from "~/components/products/product-options-choices";
import { intializeWorkSession } from "~/server/auth/auth-work-session.server";
import { getProductOption } from "~/server/domains/productDomain.server";

export async function action({ params, request }: ActionFunctionArgs) {
  const { storeId } = await intializeWorkSession(request);

  return json({});
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { storeId } = await intializeWorkSession(request);

  const productId = params.productId ?? "none";
  const optionId = params.optionId ?? "none";

  const productOption = await getProductOption({
    storeId, productId,
    optionId
  })

  const choices = productOption.choices;

  const choiceRows = choices.map((choice) => {
    return {
      choiceId: choice.id,
      optionId,
      name: choice.name,
      description: choice.description,
      priceRange: choice.priceRange,
    }
  })


  return json({ productOption, choiceRows });
}



export default function ProductOptionIdRoute() {
  const { productOption, choiceRows } = useLoaderData<typeof loader>();



  return (
    <main className="">
      <ProductOptionCard productOption={productOption}>
        <StandardDataTable columns={productOptionChoicesColumnsLong} data={choiceRows} />

      </ProductOptionCard>
    </main>
  );
}