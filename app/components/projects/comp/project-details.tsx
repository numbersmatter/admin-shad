import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { ProjectTaskList } from "./project-task-list";
import { projectTaskColumnsLong, projectTaskColumnsShort, projectTaskTestData } from "./task-columns";
import { Button } from "~/components/ui/button";


export function ProjectDetails({
  editDialogue,
}: {
  editDialogue: React.ReactNode
}) {
  return (
    <div className=" max-w-4xl mx-auto">
      <Card className=" w-full  bg-muted rounded-none md:rounded-md ">
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
              11/12/2020
            </span>
          </p>
        </CardHeader>
        <CardContent className="flex flex-col space-y-3">
          <div className="">
            <Label className="text-lg font-semibold underline underline-offset-2">
              Notes:
            </Label>
            <p>
              Some notes about the project. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            </p>
          </div>
          <div className="p-2 bg-popover border-1 rounded-sm md:hidden">
            <ProjectTaskList
              columns={projectTaskColumnsShort}
              data={projectTaskTestData}
            />
          </div>
          <div className="hidden p-2 bg-popover border-1 rounded-sm md:block">
            <ProjectTaskList
              columns={projectTaskColumnsLong}
              data={projectTaskTestData}
            />
          </div>


        </CardContent>
      </Card>
    </div>
  );
}