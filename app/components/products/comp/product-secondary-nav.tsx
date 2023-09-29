import { Arrow, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@radix-ui/react-dropdown-menu";
import { NavLink } from "@remix-run/react";
import { ArrowUpIcon, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"


const tabs = [
  {
    id: "index",
    name: "Product Basics",
    to: ``,
    end: true,
  },
  {
    id: `images`,
    name: "Product Images",
    to: `/images`,
    end: false,
  },
  {
    id: `details`,
    name: "Product Details",
    to: `/details`,
    end: false,
  },
  {
    id: `options`,
    name: "Product Options",
    to: `/options`,
    end: false,
  },
  {
    id: `form`,
    name: "Product Form",
    to: `/form`,
    end: false,
  },
  {
    id: `task-list`,
    name: "Task List",
    to: `/task-list`,
    end: false,
  },
];



export function ProductSecondaryNav({
  productId,
  defaultTab,
}: {
  productId: string;
  defaultTab: string;
}) {

  const productPath = `/products/${productId}`;

  const navTabs = tabs.map((item) => {
    return (
      {
        id: item.id,
        name: item.name,
        to: `${productPath}${item.to}`,
        end: item.end,
      }
    )
  })
  const menuText = tabs.find((item) => item.id === defaultTab)?.name ?? "Navigate To:";

  const handleTabChange = (value: string) => {
    return
  };

  return (
    <div className="py-3 px-2">
      <div className="w-full  md:hidden">
        <DropdownMenu >
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="w-full">
              <div className="flex w-full font-semibold text-lg justify-between gap-4">
                <p>
                  Navigate To:
                </p>
                <ChevronDown className="h-5 w-5" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[350px] max-w-sm bg-muted">
            <DropdownMenuLabel>Section:</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              defaultValue={defaultTab}
              onValueChange={handleTabChange}
            >
              {
                tabs.map((item) => {
                  return (
                    <DropdownMenuRadioItem className="py-2 font-medium text-center leading-6" key={item.id} value={item.id}>
                      {item.name}
                    </DropdownMenuRadioItem>
                  )
                }
                )
              }
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
      <div className="hidden md:block">

        <nav>
          <ul
            className="flex min-w-full flex-none gap-x-6 text-sm font-semibold leading-6 "
          >
            {navTabs.map((item) => (
              <li key={item.name} className="" >
                <NavLink end={item.end} to={item.to} className={({ isActive }) => isActive ? 'font-bold text-lg text-primary-foreground' : 'text-secondary-foreground underline underline-offset-1'}>
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>

  )
}