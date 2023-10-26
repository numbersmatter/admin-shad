import { ReactNode } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { ProductDetailAddItemDialog } from "./product-add-detail-item";
import { ProductDetailDeleteDialog } from "./product-detail-delete-dialog";




export function ProductOptionCard({
  productOption,
  children
}: {
  productOption: any,
  children: ReactNode
}) {

  const { option } = productOption;
  console.log({ option })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Option name {productOption.option.name}</CardTitle>

      </CardHeader>
      <CardContent>
        {children}

      </CardContent>
      <CardFooter className="flex justify-between">
      </CardFooter>
    </Card>
  )


}
