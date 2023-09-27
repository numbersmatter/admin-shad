import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { StandardShell } from "~/components/shell/shell";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";

export async function action({ params, request }: ActionFunctionArgs) {

  return json({});
}

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
    id: i,
    title: `Stand Commission ${i}`,
    description: "crows-call-home-longingly",
    // randomly assign tags to requests
    tags: Math.random() > .5 ? tags : tags2,
    date: date.toLocaleDateString(),
  }));


  return json({ requests });
}



export default function ReviewIndexRoute() {
  const { requests } = useLoaderData<typeof loader>();





  return (
    <StandardShell>
      {/* <div className="flex flex-row"> */}

      <nav id="request-list" className="h-full w-full  border-muted-foreground   overflow-y-auto bg-stone-600 md:border-r-4  md:w-[330px]">
        <div className="relative ">
          <div className="pb-1 pt-2 bg-muted text-xl text-center sticky top-0 border-y border-b-muted-foreground border-2  font-semibold leading-6">
            <h3>Requests</h3>
          </div>
          <div className="flex flex-col px-4 gap-3 md:gap-0 md:px-0" >
            {/* <ScrollArea className="  "> */}
            {
              requests.map((request) => (
                <Card key={request.id} className=" md:rounded-none" >
                  <CardHeader className="p-3">
                    <CardTitle>{request.title}</CardTitle>
                    <CardDescription>
                      Submitted {request.date}
                    </CardDescription>
                    <p>
                      {request.description}
                    </p>
                  </CardHeader>

                  <CardFooter className="pb-3">
                    <ProductTags tags={request.tags} />

                  </CardFooter>
                </Card>
              ))}


          </div>


          {/* </ScrollArea> */}
        </div>
      </nav>
      <main className="hidden flex-1 bg-muted md:block ">
        <div className="container h-full mx-auto sm:p-6 lg:px-8">
          <div className="flex justify-center items-center h-full w-full rounded-xl border-4 border-dashed border-muted-foreground">
            <h3 className="text-xl leading-6"> Choice an Option</h3>
          </div>


        </div>
      </main>

      {/* </div> */}
    </StandardShell>
  );
}

export interface Tag {
  text: string;
  id: string;
  optionId?: string;
  index: number;
}



function ProductTags({ tags, size }: { tags: Tag[], size?: "small" | "large" }) {
  const tagStyles = {
    0: "text-sky-200 bg-sky-700/70 ring-sky-300/10 ring-inset ring-2",
    1: "text-green-300 bg-green-700/40 ring-green-300/10 ring-inset ring-2",
    2: "text-yellow-300 bg-yellow-400/40 ring-yellow-400/10 ring-inset ring-2",
    3: "text-rose-200 bg-rose-700/40 ring-rose-300/10 ring-inset ring-2",
  }

  const sizeClass = size == undefined ? "small" : size;

  const sizeStyles = {
    small: "py-1 px-2 text-xs",
    large: "text-sm py-2 px-3"
  }


  return <div className="px-2 py-1 flex flex-wrap gap-2">
    {tags.map((tag) => {
      if (tag.index < 0) return null;

      const cssText = tag.index > 3
        ? tagStyles[3]
        // @ts-ignore
        : tagStyles[tag.index];

      return (
        <div
          key={tag.id}
          className={cn(
            cssText,
            sizeStyles[sizeClass],
            'rounded-full flex-none  font-medium '
          )}
        >
          {tag.text}
        </div>
      );
    })}
  </div>;
}
