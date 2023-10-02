import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ReviewList } from "~/components/review/comp/review-list";
import { StandardShell } from "~/components/shell/shell";
import { intializeWorkSession } from "~/server/auth/auth-work-session.server";
import { ProposalCard } from "~/server/domains/domain-types";
import { getProposals } from "~/server/domains/proposals-domain.server";


export async function action({ params, request }: ActionFunctionArgs) {

  return json({});
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { storeId, uid, session } = await intializeWorkSession(request);

  const {
    proposalCards,

  } = await getProposals({ storeId })


  return json({ proposalCards });
  // const tags = [
  //   {
  //     text: "single character",
  //     id: "1char",
  //     index: 0,
  //   },
  //   {
  //     text: "Complex background",
  //     id: "2",
  //     index: 1,
  //   },
  //   {
  //     text: "Long Story",
  //     id: "3",
  //     index: 3,
  //   },
  // ]
  // const tags2 = [
  //   {
  //     text: "single character",
  //     id: "1char",
  //     index: 0,
  //   },
  //   {
  //     text: "short Story",
  //     id: "2",
  //     index: 3,
  //   },
  // ]

  // const date = new Date();
  // const requests: ProposalCard[]  = Array.from({ length: 25 }).map((_, i) => ({
  //   id: i.toString(),
  //   title: `Stand Commission ${i}`,
  //   description: "crows-call-home-longingly",
  //   // randomly assign tags to requests
  //   tags: Math.random() > .5 ? tags : tags2,
  //   date: date.toLocaleDateString(),
  // }));


  // return json({ requests });
}



export default function ReviewIndexRoute() {
  const { proposalCards } = useLoaderData<typeof loader>();


  return (
    <StandardShell>
      <nav id="request-list" className="h-full w-full  border-muted-foreground   overflow-y-auto bg-stone-600 md:border-r-4  md:w-[300px] xl:w-[350px]">
        {/* @ts-ignore */}
        <ReviewList requests={proposalCards} />
      </nav>
      <main className="hidden flex-1 bg-muted md:block ">
        <div className="container h-full mx-auto sm:p-6 lg:px-8">
          <div className="flex justify-center items-center h-full w-full rounded-xl border-4 border-dashed border-muted-foreground">
            <h3 className="text-xl leading-6"> Choice an Options</h3>
          </div>
        </div>
      </main>
    </StandardShell>
  );
}


