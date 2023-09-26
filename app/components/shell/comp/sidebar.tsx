
import { Form, NavLink } from "@remix-run/react";

import { cn } from "~/lib/utils";
import {
  ArrowLeftOnRectangleIcon,
  BookOpenIcon,
  BriefcaseIcon,
  BuildingStorefrontIcon,
  ChartBarSquareIcon,
  InboxStackIcon,
  ViewColumnsIcon,
} from "@heroicons/react/24/outline";

export const navIcons = [
  {
    id: "dash",
    name: "Dashboard",
    to: `/`,
    icon: ChartBarSquareIcon,
    end: true,
  },
  {
    id: "review",
    name: "Review Proposals",
    to: `/review`,
    icon: InboxStackIcon,
    end: false,
  },
  {
    id: "projects",
    name: "Projects",
    to: `/projects`,
    icon: BriefcaseIcon,
    end: false,
  },
  {
    id: "products",
    name: "Products & Services",
    to: `/products`,
    icon: BookOpenIcon,
    end: false,
  },
  {
    id: "workboard",
    name: "Workboard",
    to: `/workboard`,
    icon: ViewColumnsIcon,
    end: false,
  },
  {
    id: "studio",
    name: "Studio",
    to: `/studio`,
    icon: BuildingStorefrontIcon,
    end: false,
  },
];

const navIcon2 = {
  dash: <ChartBarSquareIcon className=" h-6 w-6 text-secondary-foreground hover:bg-secondary/80 " aria-hidden="true" />,
  review: <InboxStackIcon className=" h-6 w-6 text-secondary-foreground hover:bg-secondary/80 " aria-hidden="true" />,
  projects: <BriefcaseIcon className="  h-6 w-6 " aria-hidden="true" />,
  products: <BookOpenIcon className="  h-6 w-6 " aria-hidden="true" />,
  workboard: <ViewColumnsIcon className="  h-6 w-6 " aria-hidden="true" />,
  studio: <BuildingStorefrontIcon className=" h-6 w-6 " aria-hidden="true" />,

}



export const navigation = [
  {
    id: "dash",
    name: "Dashboard",
    to: `/`,
    icon: ChartBarSquareIcon,
    end: true,
  },
  {
    id: "review",
    name: "Review Proposals",
    to: `/review`,
    icon: InboxStackIcon,
    end: false,
  },
  {
    id: "projects",
    name: "Projects",
    to: `/projects`,
    icon: BriefcaseIcon,
    end: false,
  },
  {
    id: "products",
    name: "Products & Services",
    to: `/products`,
    icon: BookOpenIcon,
    end: false,
  },
  {
    id: "workboard",
    name: "Workboard",
    to: `/workboard`,
    icon: ViewColumnsIcon,
    end: false,
  },
  {
    id: "studio",
    name: "Studio",
    to: `/studio`,
    icon: BuildingStorefrontIcon,
    end: false,
  },
];






export function DesktopSideBar(
) {
  return (
    <>
      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 px-6">
          <div className="flex h-16 shrink-0 items-center gap-3 border-b-2">
            <img
              className="h-8 w-auto"
              src="https://firebasestorage.googleapis.com/v0/b/furry-artist.appspot.com/o/furbrush%2FFM%20logo%201.png?alt=media&token=fb824224-21ca-4337-b6b9-0fb94b4005d1"
              alt="Furbrush"
            />
            <span className="text-slate-100 text-2xl font-black">
              Furbrush
            </span>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.to}
                        end={item.end}
                        className={({ isActive, }) =>
                          cn(
                            isActive
                              ? "text-primary-foreground bg-primary/80"
                              : "",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 text-accent-foreground hover:bg-secondary/80"
                          )
                        }
                      >
                        {
                          // @ts-ignore
                          navIcon2[item.id]
                        }
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>

              <li className=" mt-auto  pb-3">
                <Form
                  className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900"
                  method="POST"
                  action="/logout"
                >
                  <button
                    className="flex items-center decoration-2 gap-x-1 py-3 text-lg underline underline-offset-4 font-semibold leading-6 text-slate-100 hover:bg-gray-50"
                    name="_action"
                    value="logout"
                  >
                    <ArrowLeftOnRectangleIcon
                      className="flex-shrink-0 h-6 w-6 text-slate-100"
                      aria-hidden="true"
                    />
                    Logout
                  </button>
                </Form>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}



export function MobileSideBar() {
  return (
    <>
      <div className="flex grow flex-col bg-background  gap-y-5 overflow-y-auto px-6 pb-2">
        <div className="flex h-16 shrink-0 items-center">
          <img
            className="h-8 w-auto"
            src="https://firebasestorage.googleapis.com/v0/b/furry-artist.appspot.com/o/furbrush%2FFM%20logo%201.png?alt=media&token=fb824224-21ca-4337-b6b9-0fb94b4005d1"
            alt="Furbrush"
          />
        </div>
        <nav className="flex flex-1 flex-col">
          <ul className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      className={({ isActive, }) =>
                        cn(
                          isActive
                            ? "text-primary-foreground bg-primary/80"
                            : "",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 text-accent-foreground hover:bg-secondary/80"
                        )
                      }
                    >
                      {
                        // @ts-ignore
                        navIcon2[item.id]
                      }
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
