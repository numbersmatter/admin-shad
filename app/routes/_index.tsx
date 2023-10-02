import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { MetaFunction } from "@remix-run/react";
import { Dashboard } from "~/components/dashboard/dashboard";
import { StandardShell } from "~/components/shell/shell";
import { intializeWorkSession } from "~/server/auth/auth-work-session.server";
import { dashboardActions, getDashboardData } from "~/server/domains/dashboard-domain.server";


export const meta: MetaFunction = () => {
  return [
    { title: "Furbrush" },
    {
      property: "og:title",
      content: "Furbrush",
    },
    {
      name: "description",
      content: "This app is made by artist for artists.",
    },
  ];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { storeId } = await intializeWorkSession(request);

  const {
    storeStatus, productsList, dashboardData, dashboardProjects
  } = await getDashboardData({ storeId });


  return json({ storeStatus, productsList, dashboardData, dashboardProjects });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { storeId } = await intializeWorkSession(request);

  const values = Object.fromEntries(await request.formData())
  const _action = values._action as string

  if (_action === "createProduct") {
    throw redirect("products")
  }

  const { toggleProviderStoreStatus, } = dashboardActions;


  if (_action === "updateStoreStatus") {
    const storeStatus = values.storeStatus as string
    const newStatus = storeStatus === "open" ? "closed" : "open"

    await toggleProviderStoreStatus(storeId, newStatus)
    return json({ message: "Status Updated" }, { status: 200 })
  }

  // if (_action === "updateProductStatus") {
  //   const productId = values.productId as string
  //   const productStatus = values.productStatus as string
  //   const currentlyEnabled = values.enabled as string
  //   const newStatus = productStatus === "open" ? "closed" : "open"

  //   await toggleProductAvailability({ productId, storeId, availability: newStatus })

  //   return json({ message: "Status Updated" }, { status: 200 })
  // }

  return json({ message: "No Action Taken" }, { status: 200 })
}



export default function Index() {
  return (
    <StandardShell>
      <Dashboard />
    </StandardShell>
  );
}
