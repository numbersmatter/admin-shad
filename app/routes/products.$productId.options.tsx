import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { performMutation } from "remix-forms";
import { ProductOptionDialog } from "~/components/products/comp/product-option-add-option";
import { productOptionColumnsLong } from "~/components/products/product-options-columns";
import { ProjectDataTable } from "~/components/projects/comp/project-data-table";
import { intializeWorkSession } from "~/server/auth/auth-work-session.server";
import { AddOptionSchema, MoveOptionSchema } from "~/server/domains/product-schemas";
import { addProductOptionMutation, getProductOptions, moveProductOptionMutation } from "~/server/domains/productDomain.server";

export async function action({ params, request }: ActionFunctionArgs) {
  const { storeId, } = await intializeWorkSession(request);
  const formData = await request.clone().formData();

  const productId = params.productId ?? "none";
  const action = formData.get("_action");

  switch (action) {
    case "moveOption":
      const result = await performMutation({
        request,
        mutation: moveProductOptionMutation({ storeId, productId }),
        schema: MoveOptionSchema,
      })

      if (!result.success) {
        console.log("result", result)
        return json(result, 400)
      }
      return json({ success: true, message: "option moved" })
    case "addOption":
      const addResult = await performMutation({
        request,
        mutation: addProductOptionMutation({ storeId, productId }),
        schema: AddOptionSchema
      })
      if (!addResult.success) {
        return json(addResult, 400)
      }
      return json({ success: true, message: "option added" })
    default:
      return json({ message: "no action taken" });
  }

}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { storeId } = await intializeWorkSession(request);

  const validOptions = await getProductOptions({ storeId, productId: params.productId ?? "none" })


  return json({ validOptions });
}



export default function ProductOptions() {
  const { validOptions } = useLoaderData<typeof loader>();
  return (
    <>
      <main className="flex h-full flex-1 flex-col space-y-8 overflow-y-auto">
        <div className="flex items-center justify-between space-y-2 p-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Options</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of options for this product.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <ProductOptionDialog
              name=""
              buttonLabel="Add Option"
              title="Add Option"
              description="Add a new option to this product."
              _action="addOption"
              submitLabel="Add"
            />
          </div>
        </div>
        <div className="hidden px-0 sm:block lg:px-4">
          <div className="border-0  border-accent-foreground  lg:border-2 lg:rounded-md lg:p-4 ">
            <ProjectDataTable
              columns={productOptionColumnsLong} data={validOptions}
            />
          </div>
        </div>
        <div className="px-0  sm:hidden">
          <div className="">
            <ProjectDataTable
              columns={productOptionColumnsLong}
              data={validOptions}
            />
          </div>
        </div>
        <div className="h-8" />
      </main>
    </>

  );
}