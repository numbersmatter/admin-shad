import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { makeDomainFunction } from "domain-functions";
import { StandardDataTable } from "~/components/common/standard-data-table";
import { ProductOptionCard } from "~/components/products/comp/product-option-card";
import { productOptionChoicesColumnsLong } from "~/components/products/product-options-choices";
import { intializeWorkSession } from "~/server/auth/auth-work-session.server";
import { updateProduct } from "~/server/database/product.server";
import { DeleteOptionChoiceSchema, MoveOptionChoiceSchema, OptionChoiceSchema, OptionNameSchema } from "~/server/domains/product-schemas";
import { addProductOptionChoice, deleteProductOption, deleteProductOptionChoice, getProductOption, moveOptionChoice, renameProductOption, updateProductOptionChoice } from "~/server/domains/productDomain.server";
import { formAction } from "~/server/form-actions/form-action.server";

export async function action({ params, request }: ActionFunctionArgs) {
  const { storeId } = await intializeWorkSession(request);
  const formData = await request.clone().formData();

  const action = formData.get("_action") as string;
  const productId = params.productId ?? "none";
  const optionId = params.optionId ?? "none";

  const updateName = makeDomainFunction(OptionNameSchema)(async (values) => {
    await renameProductOption({
      storeId,
      productId,
      optionId,
      optionName: values.name
    })
    return { message: "saved", success: true };
  });

  const addOptionChoice = makeDomainFunction(OptionChoiceSchema)(
    async (values) => {
      await addProductOptionChoice({
        storeId,
        productId,
        optionId,
        choiceData: {
          name: values.name,
          description: values.description,
          priceRange: values.priceRange,
          id: '',
        }

      })
      return { message: "saved", success: true };
    });
  const editOptionChoice = makeDomainFunction(OptionChoiceSchema)(
    async (values) => {
      await updateProductOptionChoice({
        storeId,
        productId,
        optionId,
        choiceId: values.choiceId,
        choiceData: {
          name: values.name,
          description: values.description,
          priceRange: values.priceRange,
          id: values.choiceId,
        }
      })
      return { message: "saved", success: true };
    });

  const deleteOptionChoiceMutation = makeDomainFunction(DeleteOptionChoiceSchema)(
    async (values) => {
      await deleteProductOptionChoice({
        storeId,
        productId,
        optionId,
        choiceId: values.choiceId,
      })
      return { message: "deleted", success: true };
    });

  const moveOptionChoiceMutation = makeDomainFunction(MoveOptionChoiceSchema)(
    async (values) => {
      await moveOptionChoice({
        storeId,
        productId,
        optionId,
        choiceId: values.choiceId,
        direction: values.direction,
      })
      return { message: "saved", success: true };
    });

  if (action === "editOptionName") {
    return formAction({
      request,
      mutation: updateName,
      schema: OptionNameSchema,
    })
  }

  if (action === "addOptionChoice") {
    return formAction({
      request,
      mutation: addOptionChoice,
      schema: OptionChoiceSchema,
    })
  }

  if (action === "editOptionChoice") {
    return formAction({
      request,
      mutation: editOptionChoice,
      schema: OptionChoiceSchema,
    })
  }
  if (action === "moveOptionChoice") {
    return formAction({
      request,
      mutation: moveOptionChoiceMutation,
      schema: MoveOptionChoiceSchema,
    })
  }
  if (action === "deleteOptionChoice") {
    return formAction({
      request,
      mutation: deleteOptionChoiceMutation,
      schema: DeleteOptionChoiceSchema,
    })
  }

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