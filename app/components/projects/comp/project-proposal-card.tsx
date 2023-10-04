import { NavigateFunction } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { ProposalReview } from "~/server/domains/domain-types";
import { DisplayResponse } from "~/components/review/comp/display-response";
import { ProductTags } from "~/components/review/comp/product-tags";


export function ProjectProposalCard({
  proposalReview,
}: {
  proposalReview: ProposalReview,
}) {

  const userResponses = proposalReview.displayFields.map((field) => {
    const textResponse = proposalReview.userResponse.hasOwnProperty(field.id)
      ? proposalReview.userResponse[field.id]
      : "no text found";
    const images = proposalReview.userImages.hasOwnProperty(field.id)
      ? proposalReview.userImages[field.id]
      : [];

    if (proposalReview.userImages.hasOwnProperty(field.id)) {
      return {
        label: field.label,
        value: textResponse,
        images: images
      }
    }


    return {
      label: field.label,
      value: textResponse,
    }
  })

  return (
    <Card className="rounded-none border-2 border-b-muted-foreground xl:rounded-lg xl:border-muted-foreground">
      <CardHeader>
        <CardTitle>{proposalReview.productName}</CardTitle>
        <CardDescription>
          {proposalReview.humanId}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 md:px-2">
        <ProductTags size="large" tags={proposalReview.tags} />
        <div className="mt-2 border-t border-muted-foreground">
          <dl className="divide-y divide-muted-foreground">
            {
              userResponses.map((response, index) => (
                <DisplayResponse
                  key={index}
                  response={response}
                />
              ))
            }
          </dl>
        </div>
      </CardContent>
      <CardFooter>
      </CardFooter>

    </Card>
  )
}



