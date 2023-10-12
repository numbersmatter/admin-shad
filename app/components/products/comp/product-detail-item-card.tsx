import { ReactNode } from "react";
import { Card, CardContent, CardFooter, } from "~/components/ui/card";
import { ProductDetailItemEditDialog } from "./product-detail-item-edit-dialog";
import { Button } from "~/components/ui/button";




export function ProductDetailItemCard({
  item,
}: {
  item: any,
}) {

  return (
    <Card>
      <CardContent>
        <p className="py-2">
          {item.value}
        </p>

      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <Button variant="destructive" >delete</Button>
        </div>
        <ProductDetailItemEditDialog
          inputDefaultValue={item.value}
          _action={"updateDetailItem"}
          itemId={item.id}
        />


      </CardFooter>
    </Card>
  )


}






