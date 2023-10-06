import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";




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
    </Card>
  )


}
