import { Link } from "@remix-run/react"
import { Disclosure, } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { z } from "zod";
import { cn } from "~/lib/utils";

export interface DisplayDetail {
  id: string
  name: string
  type: string
  items: { id: string, value: string }[]
}



export function ProductDetailList({ details }: { details: DisplayDetail[] }) {
  return (
    <div className="divide-y divide-gray-200 text-slate-200 border-t">
      {details.map((detail) => (
        <Disclosure as="div" key={detail.name}>
          {({ open }) => (
            <>
              <h3>
                <Disclosure.Button className="group relative flex w-full items-center justify-between py-6 text-left">
                  <span
                    className={cn(open ? 'text-slate-100 underline underline-offset-2' : '', 'text-lg font-medium')}
                  >
                    {detail.name}
                  </span>
                  <span className="ml-6 flex items-center">
                    {open ? (
                      <MinusIcon
                        className="block h-6 w-6  group-hover:text-indigo-500"
                        aria-hidden="true"
                      />
                    ) : (
                      <PlusIcon
                        className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </Disclosure.Button>
              </h3>
              <Disclosure.Panel as="div" className="prose pb-6">
                <DisplayDetails detail={detail} />
                <div className="mt-3">
                  <Link className="text-slate-100 mt-3 border px-3 py-2" to={detail.id}>
                    Edit
                  </Link>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ))}
    </div>
  )
}




function DisplayDetails({ detail }: {
  detail: DisplayDetail
}) {

  if (detail.type === "bulletpoints") {
    return (
      <div className=' py-2 flex flex-col gap-1 px-3 border rounded-lg border-slate-600 bg-slate-950'>
        <ul className='text-slate-300 text-base' >
          {detail.items.map((item) => (
            <li key={item.id}>{item.value}</li>
          ))}
        </ul>
        <div>
          <Link className="text-slate-100 mt-3 border px-3 py-2" to={detail.id}>
            Edit
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className=' py-2 px-3 border rounded-lg border-muted-foreground bg-muted'>
      {detail.items.map((item) => (
        <p key={item.id} className='text-primary-foreground text-base pb-2'>
          {item.value}
        </p>
      ))}
    </div>
  )
}


