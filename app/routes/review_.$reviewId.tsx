import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { Fragment, useState } from "react";
import { DisplayResponse } from "~/components/review/comp/display-response";
import { ProductTags } from "~/components/review/comp/product-tags";
import { ReviewList } from "~/components/review/comp/review-list";
import { ReviewProposalCard } from "~/components/review/comp/review-proposal-card";
import ReviewStatusDropDown from "~/components/review/comp/review-status-dropdown";
import { StandardShell } from "~/components/shell/shell";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { intializeWorkSession } from "~/server/auth/auth-work-session.server";
import { getReviewIdPageData } from "~/server/domains/proposals-domain.server";


export async function loader({ request, params }: LoaderFunctionArgs) {
  const { storeId, uid, session } = await intializeWorkSession(request);
  const proposalId = params.reviewId ?? "default"

  const {
    proposalCards,
    proposalReview
  } = await getReviewIdPageData({ storeId, proposalId })




  return json({ proposalCards, proposalReview });
}



export default function ReviewIdRoute() {
  const { proposalCards, proposalReview } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

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
    <StandardShell>
      <nav id="request-list" className="hidden h-full w-full  border-muted-foreground   overflow-y-auto bg-stone-600 md:block md:border-r-4  md:w-[300px] xl:w-[350px]">
        {/* @ts-ignore */}
        <ReviewList requests={proposalCards} />
      </nav>
      <main className=" flex-1 bg-muted overflow-y-auto ">
        <div className="container mx-auto px-0 xl:px-8 xl:py-4">
          <ReviewProposalCard navigate={navigate} proposalReview={proposalReview} />

        </div>
        <div className=" bg-muted h-[30px]">

        </div>
      </main>
    </StandardShell>
  );
}




interface StatusOption {
  title: string;
  description: string;
  value: "review" | "hold" | "accepted" | "declined" | "unset";
}

const statusOptions: StatusOption[] = [
  {
    title: 'Needs Review',
    description: 'Status has not been determined.',
    value: "review"
  },
  { title: 'Hold', description: "It's a solid maybe", value: "hold" },
  { title: 'Accepted', description: "We are doing IT!", value: "accepted" },
  { title: 'Declined', description: "This idea is not for me at the moment", value: "declined" },
]



// function StatusListBox(
//   { reviewStatus, proposalId }:
//     { reviewStatus: ReviewStatus, proposalId: string }
// ) {
//   // const [selected, setSelected] = useState(statusOptions[0]);
//   const fetcher = useFetcher();
//   const submit = fetcher.submit;

//   // const temporaryProjectStatus = fetcher.formData
//   //   ? fetcher.formData.get("reviewStatus")
//   //   : reviewStatus;


//   const currentStatus = statusOptions
//     .find((option) => option.value === reviewStatus)
//     ??
//   {
//     title: "Unset Status",
//     description: "This project has no status.",
//     value: "unset"
//   };



//   const onStatusChange = (option: StatusOption) => {
//     submit({
//       _action: "updateReviewStatus",
//       proposalId: proposalId,
//       reviewStatus: option.value
//     },
//       { method: "post", })
//   };


//   const displayStatus = currentStatus;


//   return (
//     <Listbox value={displayStatus} onChange={onStatusChange}>
//       {({ open }) => (
//         <>
//           <Listbox.Label className="sr-only">Change review status</Listbox.Label>
//           <div className="relative">
//             <div className="inline-flex divide-x divide-indigo-700 rounded-md shadow-sm">
//               <div className="inline-flex items-center gap-x-1.5 rounded-l-md bg-indigo-600 px-3 py-2 text-white shadow-sm">
//                 <CheckIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
//                 <p className="text-sm font-semibold">{displayStatus.title}</p>
//               </div>
//               <Listbox.Button className="inline-flex items-center rounded-l-none rounded-r-md bg-indigo-600 p-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-gray-50">
//                 <span className="sr-only">Change review status</span>
//                 <ChevronDownIcon className="h-5 w-5 text-white" aria-hidden="true" />
//               </Listbox.Button>
//             </div>

//             <Transition
//               show={open}
//               as={Fragment}
//               leave="transition ease-in duration-100"
//               leaveFrom="opacity-100"
//               leaveTo="opacity-0"
//             >
//               <Listbox.Options className=" right-0 z-80 mt-2 w-72 origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//                 {statusOptions.map((option) => (
//                   <Listbox.Option
//                     key={option.title}
//                     className={({ active }) =>
//                       cn(
//                         active ? 'bg-indigo-600 text-white' : 'text-gray-900',
//                         'cursor-default select-none p-4 text-sm'
//                       )
//                     }
//                     value={option}
//                   >
//                     {({ selected, active }) => (
//                       <div className="flex flex-col">
//                         <div className="flex justify-between">
//                           <p className={selected ? 'font-semibold' : 'font-normal'}>{option.title}</p>
//                           {selected ? (
//                             <span className={active ? 'text-white' : 'text-indigo-600'}>
//                               <CheckIcon className="h-5 w-5" aria-hidden="true" />
//                             </span>
//                           ) : null}
//                         </div>
//                         <p className={cn(active ? 'text-indigo-200' : 'text-gray-500', 'mt-2')}>
//                           {option.description}
//                         </p>
//                       </div>
//                     )}
//                   </Listbox.Option>
//                 ))}
//               </Listbox.Options>
//             </Transition>
//           </div>
//         </>
//       )}
//     </Listbox>
//   )
// }




