import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { ProductTags } from "./product-tags";
import { ProposalCard, ReviewStatus } from "~/server/domains/domain-types";


export type ReviewListCardData = {
  id: string,
  title: string,
  // description: string,
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
  request: ProposalCard   //ReviewListCardData
  current?: boolean
}) {
  const styleClass = current ? "bg-secondary md:rounded-none" : "md:rounded-none";

  const status = request.reviewStatus;

  const reviewStatusStyles = (status: ReviewStatus) => {
    return {
      "pending": "text-yellow-500",
      "accepted": "text-green-500",
      "declined": "text-red-500",
      "hold": "text-yellow-500",
      "unset": "text-gray-500",
      "review": "text-yellow-500",
    }[status]

  }

  return <Card key={request.id} className={styleClass}>
    <CardHeader className="p-3 ">
      <CardTitle className={`${reviewStatusStyles(status)}`}>{request.productName}</CardTitle>
      <CardDescription>
        Submitted {request.submittedAtString}
      </CardDescription>
      <p>
        {request.humanId}
      </p>
    </CardHeader>
    <CardFooter className="pb-3">
      <ProductTags tags={request.tags} />
    </CardFooter>
  </Card>;
}
