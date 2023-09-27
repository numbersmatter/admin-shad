

export function DisplayTextResponse({
  response
}: {
  response: { label: string, value: string },
}) {
  return (
    <div className=" px-4 py-6 xl:grid xl:grid-cols-3 xl:gap-4 xl:px-3">
      <dt className="text-lg text-slate-200 underline underline-offset-2 font-semibold leading-6 ">
        {response.label} :
      </dt>
      <dd className="mt-1 text-slate-100 text-base font-medium leading-6 sm:col-span-2 sm:mt-0">
        {response.value ?? "No response"}
      </dd>
    </div>
  )
}