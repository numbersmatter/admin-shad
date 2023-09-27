import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { ProductTags } from "./product-tags";


export type ReviewListCardData = {
  id: string,
  title: string,
  description: string,
  tags: {
    text: string,
    id: string,
    index: number,
  }[],
  dateString: string,
}

export function ReviewListCard({
  request,
  current,
}: {
  request: ReviewListCardData
  current?: boolean
}) {
  const styleClass = current ? "bg-secondary md:rounded-none" : "md:rounded-none";

  return <Card key={request.id} className={styleClass}>
    <CardHeader className="p-3 ">
      <CardTitle>{request.title}</CardTitle>
      <CardDescription>
        Submitted {request.dateString}
      </CardDescription>
      <p>
        {request.description}
      </p>
    </CardHeader>
    <CardFooter className="pb-3">
      <ProductTags tags={request.tags} />
    </CardFooter>
  </Card>;
}
