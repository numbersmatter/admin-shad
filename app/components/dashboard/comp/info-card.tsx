import type { ReactNode } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"

type Props = {
  title: string,
  main: string,
  secondary: string,
  icon: ReactNode,
}

export function InfoCard({ title, main, secondary, icon }: Props) {

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{main}</div>
        <p className="text-xs text-muted-foreground">
          {secondary}
        </p>
      </CardContent>
    </Card>
  )
}