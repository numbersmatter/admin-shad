import { NavLink, useParams } from "@remix-run/react";
import { ReviewListCard } from "./review-list-card";
import { ProposalCard, ReviewStatus } from "~/server/domains/domain-types";


export function ReviewListSorted({
  requests,
  sortOrder,
}: {
  requests: ProposalCard[],
  sortOrder: ReviewStatus[]
}) {
  const params = useParams();
  const reviewId = params.reviewId ?? "none";

  const requestsFiltered = requests.filter((request) => {
    return sortOrder.includes(request.reviewStatus);
  })

  const requestWithSortOrder = requestsFiltered.map((request) => {
    const index = sortOrder.indexOf(request.reviewStatus);
    return {
      ...request,
      index,
    }
  })

  const requestsSorted = requestWithSortOrder.sort((a, b) => {
    return a.index - b.index;
  })

  return (
    <div className="relative ">
      <div className="pb-1 pt-2 bg-muted text-xl text-center sticky top-0 border-y border-b-muted-foreground border-2  font-semibold leading-6">
        <h3>Requests</h3>
      </div>
      <div className="flex flex-col px-4 gap-3 md:gap-0 md:px-0" >
        {
          requestsSorted.map((request) => (
            <NavLink to={`/review/${request.id}`} key={request.id}>
              <ReviewListCard
                request={request}
                current={reviewId === request.id.toString()}
              />
            </NavLink>
          ))}
      </div>
    </div>
  )
}