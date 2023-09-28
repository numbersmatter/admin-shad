import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import { Fragment, useState } from "react";
import { DisplayResponse } from "~/components/review/comp/display-response";
import { ProductTags } from "~/components/review/comp/product-tags";
import { ReviewList } from "~/components/review/comp/review-list";
import ReviewStatusDropDown from "~/components/review/comp/review-status-dropdown";
import { StandardShell } from "~/components/shell/shell";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";


export async function loader({ request }: LoaderFunctionArgs) {

  const tags = [
    {
      text: "single character",
      id: "1char",
      index: 0,
    },
    {
      text: "Complex background",
      id: "2",
      index: 1,
    },
    {
      text: "Long Story",
      id: "3",
      index: 3,
    },
  ]
  const tags2 = [
    {
      text: "single character",
      id: "1char",
      index: 0,
    },
    {
      text: "short Story",
      id: "2",
      index: 3,
    },
  ]

  const date = new Date();
  const requests = Array.from({ length: 25 }).map((_, i) => ({
    id: i.toString(),
    title: `Stand Commission ${i}`,
    description: "crows-call-home-longingly",
    // randomly assign tags to requests
    tags: Math.random() > .5 ? tags : tags2,
    date: date.toJSON(),
  }));


  return json({ requests });
}



export default function ReviewIdRoute() {
  const { requests } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const reviewListCards = requests.map((request) => (
    {
      ...request,
      dateString: new Date(request.date).toLocaleDateString(),
    }
  ));

  const responses = [
    {
      label: "Character",
      value: "Mikasa Ackerman"
    },
    {
      label: "Background",
      value: "Shingeki no Kyojin"
    },
    {
      label: "Description",
      value: "Mikasa Ackerman from Shingeki no Kyojin in a forest"
    },
    {
      label: "Notes",
      value: "I want her to be looking at the camera"
    },
    {
      label: "References",
      value: "https://i.imgur.com/8K1t6Jn.jpg"
    },
    {
      label: "Deadline",
      value: "2021-09-15"
    },
    {
      label: "Character References",
      value: "",
      images: [
        {
          id: "1",
          url: "https://res.cloudinary.com/db1vvwzaa/image/upload/v1694560413/Yv9MRp37B72XaMjPExK6/wtc4oytzs1bzrqnuqsmq.png",
          name: "Mikasa Ackerman",
        },
        {
          id: "2",
          url: "https://res.cloudinary.com/db1vvwzaa/image/upload/v1694560423/Yv9MRp37B72XaMjPExK6/zxo737yjelk9uit93nq6.png",
          name: "Mikasa Ackerman",
        },
        {
          id: "2",
          url: "https://res.cloudinary.com/db1vvwzaa/image/upload/v1694560435/Yv9MRp37B72XaMjPExK6/bfiojjyrrmekypdt3tzv.jpg",
          name: "Mikasa Ackerman",
        },

      ]
    },
    {
      label: "Email",
      value: "someEmail@email.com"
    },
  ]

  return (
    <StandardShell>
      <nav id="request-list" className="hidden h-full w-full  border-muted-foreground   overflow-y-auto bg-stone-600 md:block md:border-r-4  md:w-[300px] xl:w-[350px]">
        <ReviewList requests={reviewListCards} />
      </nav>
      <main className=" flex-1 bg-muted overflow-y-auto ">
        <div className="container mx-auto px-0 xl:px-8 xl:py-4">
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
              <CardTitle>Standard Commission</CardTitle>
              <CardDescription>
                Calkling-crows-called-callously
              </CardDescription>
              <div className="flex justify-start items-center gap-2">
                <p className="text-lg font-medium">Current Status:</p>
                <ReviewStatusDropDown />
              </div>
            </CardHeader>
            <CardContent className="px-0 md:px-2">
              <ProductTags size="large" tags={reviewListCards[0].tags} />
              <div className="mt-2 border-t border-muted-foreground">
                <dl className="divide-y divide-muted-foreground">
                  {
                    responses.map((response, index) => (
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

export type ReviewStatus =
  | "pending"
  | "hold"
  | "accepted"
  | "declined"
  | "unset"
  | "review";


function StatusListBox(
  { reviewStatus, proposalId }:
    { reviewStatus: ReviewStatus, proposalId: string }
) {
  // const [selected, setSelected] = useState(statusOptions[0]);
  const fetcher = useFetcher();
  const submit = fetcher.submit;

  // const temporaryProjectStatus = fetcher.formData
  //   ? fetcher.formData.get("reviewStatus")
  //   : reviewStatus;


  const currentStatus = statusOptions
    .find((option) => option.value === reviewStatus)
    ??
  {
    title: "Unset Status",
    description: "This project has no status.",
    value: "unset"
  };



  const onStatusChange = (option: StatusOption) => {
    submit({
      _action: "updateReviewStatus",
      proposalId: proposalId,
      reviewStatus: option.value
    },
      { method: "post", })
  };


  const displayStatus = currentStatus;


  return (
    <Listbox value={displayStatus} onChange={onStatusChange}>
      {({ open }) => (
        <>
          <Listbox.Label className="sr-only">Change review status</Listbox.Label>
          <div className="relative">
            <div className="inline-flex divide-x divide-indigo-700 rounded-md shadow-sm">
              <div className="inline-flex items-center gap-x-1.5 rounded-l-md bg-indigo-600 px-3 py-2 text-white shadow-sm">
                <CheckIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                <p className="text-sm font-semibold">{displayStatus.title}</p>
              </div>
              <Listbox.Button className="inline-flex items-center rounded-l-none rounded-r-md bg-indigo-600 p-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-gray-50">
                <span className="sr-only">Change review status</span>
                <ChevronDownIcon className="h-5 w-5 text-white" aria-hidden="true" />
              </Listbox.Button>
            </div>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className=" right-0 z-80 mt-2 w-72 origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {statusOptions.map((option) => (
                  <Listbox.Option
                    key={option.title}
                    className={({ active }) =>
                      cn(
                        active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                        'cursor-default select-none p-4 text-sm'
                      )
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <div className="flex flex-col">
                        <div className="flex justify-between">
                          <p className={selected ? 'font-semibold' : 'font-normal'}>{option.title}</p>
                          {selected ? (
                            <span className={active ? 'text-white' : 'text-indigo-600'}>
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </div>
                        <p className={cn(active ? 'text-indigo-200' : 'text-gray-500', 'mt-2')}>
                          {option.description}
                        </p>
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}




