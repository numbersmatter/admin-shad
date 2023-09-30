import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { ProductBasicCard } from "~/components/products/comp/product-basic-card";
import ProductDescriptionList from "~/components/products/comp/product-description-list";
import { ProductSecondaryNav } from "~/components/products/comp/product-secondary-nav";
import { ProductTabs } from "~/components/products/comp/product-tabs";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.clone().formData();
  const action = formData.get("_action");

  switch (action) {
    case "updateName":
      return json({ status: "ok", message: "Name Updated" }, { status: 200 });
    default:
      return json({ status: "ok" }, { status: 200 });
  }
};


export async function loader({ params, request }: LoaderFunctionArgs) {
  //  const {storeId, uid, session} = await intializeWorkSession(request); 

  const productBasic = {
    name: "Standard Commission",
    priceRange: "$250 - $500",
    description: "Standard commission slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed",
    pricing: "Standard commission slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed"
  };


  return json({ productBasic });
}



export default function ProductIdRoute() {
  const { productId } = useParams();
  const { productBasic } = useLoaderData<typeof loader>();


  return (
    <div className="container ">
      <header className="w-full p-4">
        <h1 className="text-4xl font-bold">
          Standard Commission
        </h1>
        <p className="text-muted-foreground">
          Standard Commission slot
        </p>
        <div className="">
          <ProductSecondaryNav
            productId={productId ?? "/"}
            defaultTab={"index"}
          />
        </div>

      </header>
      <main className="">
        <ProductDescriptionList
          productBasic={productBasic}
        />
      </main>


    </div>
  )


}