import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "~/components/ui/card";
import { Label } from "~/components/ui/label";



export function ProjectDetails({
  editDialogue,
  createdAt,
  notes,
  children
}: {
  editDialogue: React.ReactNode,
  createdAt: string,
  notes: string,
  children: React.ReactNode
}) {
  return (
    <div className="px-0  md:px-6 lg:px-20">
      <Card className=" w-full bg-muted rounded-none md:rounded-md ">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>Project Details</CardTitle>
            {editDialogue}
          </div>
          <CardDescription>
            Amount $250.00
          </CardDescription>
          <p>
            <span className="text-sm">Created: </span>
            <span className="text-sm font-semibold">
              {createdAt}
            </span>
          </p>
        </CardHeader>
        <CardContent className="flex flex-col space-y-3">
          <div className="">
            <p className="text-lg font-semibold underline underline-offset-2">
              Notes:
            </p>
            <p>
              {notes}
            </p>
          </div>
          {children}


        </CardContent>
      </Card>
    </div>
  );
}