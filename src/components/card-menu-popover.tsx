import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisVertical } from "lucide-react"
import { MoreInfoDialog, EditTaskDialog, DeleteTaskDialog } from "./task-action-dialog"
type TaskCardProps = {
    id: number;
    name: string;
    time: string;
    kind: string;
    content: string;
    day: string;
};
function CardMenuPopover({ id, name, time, kind, content, day }: TaskCardProps) {
    return (
        < DropdownMenu >
            <DropdownMenuTrigger asChild>
                {/* <Button variant="outline" className="mr-1 h-8">+ Add</Button> */}
                <Button variant="ghost" size={"icon"}> <EllipsisVertical></EllipsisVertical></Button>

            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <MoreInfoDialog
                    id={id}
                    name={name}
                    time={time}
                    kind={kind}
                    content={content}
                    day={day}
                ></MoreInfoDialog>
                <EditTaskDialog
                    id={id}
                    name={name}
                    time={time}
                    kind={kind}
                    content={content}
                    day={day}
                ></EditTaskDialog>
                <DeleteTaskDialog
                    id={id}
                ></DeleteTaskDialog>
            </DropdownMenuContent>
        </DropdownMenu >
    )
}

export default CardMenuPopover