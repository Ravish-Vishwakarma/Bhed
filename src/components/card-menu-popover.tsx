import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisVertical } from "lucide-react"
import { MoreInfoDialog, EditTaskDialog, DeleteTaskDialog } from "./task-action-dialog"
function CardMenuPopover() {
    return (
        < DropdownMenu >
            <DropdownMenuTrigger asChild>
                {/* <Button variant="outline" className="mr-1 h-8">+ Add</Button> */}
                <Button variant="ghost" size={"icon"}> <EllipsisVertical></EllipsisVertical></Button>

            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <MoreInfoDialog></MoreInfoDialog>
                <EditTaskDialog></EditTaskDialog>
                <DeleteTaskDialog></DeleteTaskDialog>
            </DropdownMenuContent>
        </DropdownMenu >
    )
}

export default CardMenuPopover