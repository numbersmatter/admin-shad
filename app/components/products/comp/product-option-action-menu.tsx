import { useNavigate } from "@remix-run/react";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "~/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";


export function ProductOptionActionMenu({
  productId,
  optionId,
}: {
  productId: string;
  optionId: string;
}) {
  const productLink = `/products/${productId}/options/${optionId}`
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to={productLink}>
          <DropdownMenuItem>Go to Option</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}