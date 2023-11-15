import { NavigateFunction } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { ProductTags } from "./product-tags";
import { ProposalReview } from "~/server/domains/domain-types";
import { DisplayResponse } from "~/components/review/comp/display-response";
import ReviewStatusDropDown from "./review-status-dropdown";


export function ReviewProposalCard({
  navigate,
  proposalReview,
}: {
  navigate: NavigateFunction,
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
      <div className="flex justify-between items-center px-4 py-2 border-b border-muted-foreground md:hidden">
        <Button
          variant="secondary"
          onClick={() => navigate("/review")}
        >
          Back
        </Button>
      </div>
      <CardHeader>
        <CardTitle>{proposalReview.productName}</CardTitle>
        <CardDescription>
          {proposalReview.humanId}
        </CardDescription>
        <div className="flex justify-start items-center gap-2">
          <p className="text-lg font-medium">Current Status:</p>
          <ReviewStatusDropDown reviewStatus={proposalReview.reviewStatus} />
        </div>
        <div className="flex justify-between  ">
          <Button> Make Project</Button>
          <Button variant={"destructive"}>Archive</Button>
        </div>
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
        {/* <StatusListBox
                reviewStatus="review"
                proposalId={reviewListCards[0].id}
              /> */}

      </CardFooter>

    </Card>
  )
}



