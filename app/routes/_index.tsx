import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import { DashboardHeader } from "~/components/dashboard/comp/dashboard-header";
import { RecentProjects } from "~/components/dashboard/comp/recent-projects";
import { Dashboard } from "~/components/dashboard/dashboard";
import { StandardShell } from "~/components/shell/shell";
import { intializeWorkSession } from "~/server/auth/auth-work-session.server";
import { dashboardActions, getDashboardData } from "~/server/domains/dashboard-domain.server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { InfoCard } from "~/components/dashboard/comp/info-card";
import { ChartBarIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { Overview } from "~/components/dashboard/comp/overview";


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
    storeStatus, productsList, dashboardData, dashboardProjects,
  } = await getDashboardData({ storeId });

  const cards = [
    {

    }
  ]

  const dashData = [
    {
      month: "July",
      total: dashboardData.lastMonthEarnedAmount
    },
    {
      month: "August",
      total: dashboardData.lastMonthEarnedAmount
    },
    {
      month: "September",
      total: dashboardData.lastMonthEarnedAmount
    },
    {
      month: "October",
      total: 0,
    }
  ]


  return json({ storeStatus, productsList, dashboardData, dashboardProjects, dashData });
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
  const { dashData, dashboardData, dashboardProjects } = useLoaderData<typeof loader>();

  const cards = [
    {
      title: "Last Month Earned",
      main: `$${dashboardData.lastMonthEarnedAmount}`,
      secondary: "",
      icon: <UserCircleIcon className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "This Month Earned",
      main: `$${dashboardData.thisMonthEarnedAmount}`,
      secondary: "",
      icon: <ChartBarIcon className="h-4 w-4 text-muted-foreground" />
    },
  ]

  return (
    <StandardShell>
      <div className="flex-1 overflow-y-auto">
        <DashboardHeader>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {
              cards.map((card, i) => (
                <InfoCard key={i} {...card} />
              ))
            }

          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview data={dashData} />
              </CardContent>
            </Card>
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <RecentProjects recentProjects={dashboardProjects} />
              </CardContent>
            </Card>

          </div>
        </DashboardHeader>
      </div>
    </StandardShell>
  );
}
