import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { StandardShell } from "~/components/shell/shell";

export async function action({ params, request }: ActionFunctionArgs) {

  return json({});
}

export async function loader({ request }: LoaderFunctionArgs) {


  return json({});
}



export default function FormSections() {
  const { } = useLoaderData<typeof loader>();
  return (
    <StandardShell>
    </StandardShell>
  );
}