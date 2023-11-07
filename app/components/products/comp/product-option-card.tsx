import { ReactNode } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { ButtonDialogField } from "~/components/common/button-dialogue-field";
import { ProductOptionChoice } from "./product-option-choice-dialog";




export function ProductOptionCard({
  productOption,
  children
}: {
  productOption: any,
  children: ReactNode
}) {

  const { option } = productOption;


  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle> {option.name}</CardTitle>
        <ButtonDialogField
          buttonLabel="Rename Option"
          dialogTitle="Edit Option"
          dialogDescription="Edit an option"
          inputLabel="Option Name"
          inputId="name"
          inputDefaultValue={productOption.option.name}
          saveLabel="Save Changes"
          _action="editOptionName"
        />
      </CardHeader>
      <CardContent>
        {children}

      </CardContent>
      <CardFooter className="flex justify-between">
        <ProductOptionChoice
          choiceData={
            {
              choiceName: "",
              priceRange: "",
              description: ""
            }
          }
          _action="addOptionChoice"
          openLabel="Add Choice"
          submitLabel="Save Choice"
          choiceId="addOptionChoice"
        />
      </CardFooter>
    </Card>
  )


}
