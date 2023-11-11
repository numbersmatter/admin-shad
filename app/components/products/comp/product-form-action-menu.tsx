import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "~/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";


export function ProductFormActionMenu({
  productId,
  fieldId,
}: {
  productId: string;
  fieldId: string;
}) {
  const fieldLink = `${fieldId}`
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
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(productId)}
        >
          Copy Product ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <Link to={fieldLink}>
          <DropdownMenuItem>Go to Form Field</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}