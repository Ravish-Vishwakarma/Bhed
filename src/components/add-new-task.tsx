import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Terminal, AppWindow } from "lucide-react"
export function AddNewTask() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="mr-1 h-8">+ Add</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem><Terminal></Terminal>Command</DropdownMenuItem>
                <DropdownMenuItem><AppWindow></AppWindow>Executable</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
