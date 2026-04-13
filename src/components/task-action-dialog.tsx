import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenuItem } from "./ui/dropdown-menu"
import { Info, Pencil, Trash2Icon, Folder, Clock, Plus } from "lucide-react"
import { Input } from "./ui/input"
import { Separator } from "./ui/separator"
function MoreInfoDialog() {
    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}><Info></Info> Info</DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Title</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center gap-3">
                        <Button size={"icon"} variant={"default"}>
                            <Folder></Folder>
                        </Button>
                        <p>Location</p>
                    </div>
                    <p className="font-bold">Schedule:</p>
                    <div className="flex items-center gap-2">
                        <Clock size={"15"}></Clock>
                        <p>05:20 AM</p>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant={"outline"}>Okay</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}

function EditTaskDialog() {
    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    {/* <Button variant="outline">Open Dialog</Button> */}

                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}><Pencil></Pencil> Edit</DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Edit</DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-2 items-center">
                        Title:
                        <Input placeholder="Enter text" />
                    </div>
                    <div className="flex gap-2 items-center">
                        <Button size={"icon"}>
                            <Folder></Folder>
                        </Button>
                        <Input placeholder="Enter text" />
                    </div>
                    <Separator></Separator>
                    <p className="font-bold">Schedule:</p>
                    <Input
                        type="time"
                        id="time-picker-optional"
                        step="1"
                        defaultValue="00:00:00" />
                    <Separator></Separator>
                    <div className="flex gap-2 items-center">
                        <Input
                            type="time"
                            id="time-picker-optional"
                            step="1"
                            defaultValue="00:00:00"
                            className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                        <Button size={"icon"} variant={"secondary"}>
                            <Plus></Plus>
                        </Button>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}

function DeleteTaskDialog() {
    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    {/* <Button variant="outline">Open Dialog</Button> */}

                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} variant="destructive"><Trash2Icon></Trash2Icon> Delete</DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Delete</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this task?
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" variant={"destructive"}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}


export { MoreInfoDialog, EditTaskDialog, DeleteTaskDialog };