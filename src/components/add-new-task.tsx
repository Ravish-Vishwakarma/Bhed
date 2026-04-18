import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Terminal, AppWindow } from "lucide-react"
import { AddCommand, AddExecutable } from "./task-action-dialog"
export function AddNewTask() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="mr-1 h-8">+ Add</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <AddCommand></AddCommand>
                <AddExecutable></AddExecutable>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
