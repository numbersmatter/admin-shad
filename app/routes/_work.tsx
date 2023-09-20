import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, NavLink, Outlet, useParams } from "@remix-run/react";
import {
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/20/solid";
import { DesktopSideBar, MobileSideBar } from "~/components/shell/comp/sidebar";






// @ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AppBaseLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);






  return (
    <div id="AppBaseLayout" className=" h-full w-full">
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <MobileSideBar />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <DesktopSideBar />


      <div className="h-full flex flex-col  lg:pl-64">
        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-slate-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-slate-300 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-slate-50">
            Furbrush
          </div>
          <Link to="/logout">
            <div className="flex items-center decoration-2 gap-x-1 py-3 text-lg underline underline-offset-4 font-semibold leading-6 text-slate-400 hover:bg-gray-50">
              <ArrowLeftOnRectangleIcon
                className="flex-shrink-0 h-6 w-6 text-slate-400"
                aria-hidden="true"
              />
              Logout
            </div>
          </Link>
        </div>
        <div className="flex-1" >
          <Outlet />
        </div>
        <div className="flex flex-col border-t-4 border-slate-500 items-center justify-center h-28">
          <div className="text-3xl font-semibold text-slate-100">
            Welcome to Furbrush
          </div>
        </div>
      </div>
    </div>
  );
}



