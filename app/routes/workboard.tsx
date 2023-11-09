
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import { StandardShell } from "~/components/shell/shell";
import { ShellOneColumn } from "~/components/shell/shell-one-column";

export async function action({ params, request }: ActionFunctionArgs) {
  //  const {storeId, uid, session} = await intializeWorkSession(request);  

  return json({});
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  //  const {storeId, uid, session} = await intializeWorkSession(request);  


  return json({});
}



export default function ProductsRoute() {
  const { } = useLoaderData<typeof loader>();
  return (
    <ShellOneColumn>
      <Outlet />
    </ShellOneColumn>
  );
}

