import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar"





export function RecentProjects({
  recentProjects
}: {
  recentProjects: any[]
}) {



  return (

    <div className="space-y-8">
      {
        recentProjects.map((project, index) => {
          const {
            title,
            invoiceAmount,
            completedPoints,
            totalPoints,
            earned,
            initials,
            id
          } = project;

          return (
            <div key={id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src="" alt="Avatar" />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{title}</p>
                <p className="text-sm text-muted-foreground">
                  {completedPoints}/{totalPoints} points completed.
                </p>
              </div>
              <div className="ml-auto font-medium">
                ${earned} / ${invoiceAmount}
              </div>
            </div>
          )
        })
      }
    </div>

  )
}