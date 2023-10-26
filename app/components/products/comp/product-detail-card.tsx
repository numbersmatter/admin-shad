import { ReactNode } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { ProductDetailAddItemDialog } from "./product-add-detail-item";
import { ProductDetailDeleteDialog } from "./product-detail-delete-dialog";




export function ProductDetailCard({
  detail,
  children
}: {
  detail: any,
  children: ReactNode
}) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>{detail.name}</CardTitle>

      </CardHeader>
      <CardContent>
        {children}

      </CardContent>
      <CardFooter className="flex justify-between">
        <ProductDetailAddItemDialog _action={"addItem"} />
        <ProductDetailDeleteDialog _action={"deleteDetail"} />
      </CardFooter>
    </Card>
  )


}
