import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs"
import { CalendarDateRangePicker } from "./comp/data-range-picker"
import { RecentSales } from "./comp/recent-sales"
import { Overview } from "./comp/overview"
import { ChartBarIcon, UserCircleIcon } from "@heroicons/react/20/solid"
import { UserGroupIcon } from "@heroicons/react/24/outline"
import { InfoCard } from "./comp/info-card"


const cards = [
  {
    title: "Subscriptions",
    main: "+2350",
    secondary: "+180.1% from last month",
    icon: <UserCircleIcon className="h-4 w-4 text-muted-foreground" />
  },
  {
    title: "Sales",
    main: "+12,234",
    secondary: "+19% from last month",
    icon: <ChartBarIcon className="h-4 w-4 text-muted-foreground" />
  },
  {
    title: "Active Now",
    main: "+573",
    secondary: "+201 since last hour",
    icon: <UserGroupIcon className="h-4 w-4 text-muted-foreground" />
  },
]



export function Dashboard() {

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex  flex-col items-center justify-between space-y-2 md:flex-row">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics" disabled>
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" disabled>
            Reports
          </TabsTrigger>
          <TabsTrigger value="notifications" disabled>
            Notifications
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {
              cards.map((card, i) => (
                <InfoCard key={i} {...card} />
              ))
            }

          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>
                  You made 265 sales this month.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}