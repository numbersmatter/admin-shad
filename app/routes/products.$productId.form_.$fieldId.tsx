import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { intializeWorkSession } from "~/server/auth/auth-work-session.server";

export async function action({ params, request }: ActionFunctionArgs) {
  const { storeId } = await intializeWorkSession(request);

  return json({});
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { storeId } = await intializeWorkSession(request);


  return json({});
}



export default function RouteName() {
  const { } = useLoaderData<typeof loader>();
  return (
    <main className="">

    </main>
  );
}