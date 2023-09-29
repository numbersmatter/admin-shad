import { useParams } from "@remix-run/react";
import { ProductSecondaryNav } from "~/components/products/comp/product-secondary-nav";
import { ProductTabs } from "~/components/products/comp/product-tabs";




export default function ProductIdRoute() {
  const { productId } = useParams();


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


    </div>
  )


}