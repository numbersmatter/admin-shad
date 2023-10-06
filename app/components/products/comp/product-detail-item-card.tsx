import { ReactNode } from "react";
import { Button } from "react-day-picker";
import { ButtonDialogField } from "~/components/common/button-dialogue-field";
import { ButtonDialogSingle } from "~/components/common/button-dialogue-single";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { ProductDetailItemEditDialog } from "./product-detail-item-edit-dialog";




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
      <CardFooter>
        <ProductDetailItemEditDialog
          inputDefaultValue={item.value}
          _action={"updateDetailItem"}
          itemId={item.id}
        />

      </CardFooter>
    </Card>
  )


}






