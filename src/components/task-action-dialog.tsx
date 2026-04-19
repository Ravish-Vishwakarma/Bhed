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
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Info, Pencil, Trash2Icon, Folder, Clock, Terminal, AppWindow, Plus, CalendarDays } from "lucide-react"
import { Input } from "./ui/input"
import { Separator } from "./ui/separator"
import { Badge } from "./ui/badge"
import { useState } from "react"
import { Textarea } from "./ui/textarea"
import { open } from '@tauri-apps/plugin-dialog';
import { invoke } from "@tauri-apps/api/core"
import { revealItemInDir } from '@tauri-apps/plugin-opener';
type TaskCardProps = {
    id: number;
    name: string;
    time: string;
    kind: string;
    content: string;
    day: string;
};
function MoreInfoDialog({ name, time, kind, content, day }: TaskCardProps) {
    async function showInFolder(path: string) {
        await revealItemInDir(path);
    }
    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}><Info></Info> Info</DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <div className="flex items-center">
                            <DialogTitle>{name}</DialogTitle>
                            <Badge variant="outline" className="ml-2">
                                {kind}
                            </Badge>
                        </div>
                    </DialogHeader>
                    <div className="flex items-center gap-3">

                        {kind == "executable" ?
                            <Button size={"icon"} variant={"default"} onClick={() => {
                                if (content) {
                                    showInFolder(content);
                                }
                            }}>
                                <Folder></Folder>
                            </Button> : <Terminal></Terminal>
                        }
                        <p>{content}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size={"icon"} variant={"default"}>
                            <Clock size={"15"}></Clock>
                        </Button>
                        <p>{time}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button size={"icon"} variant={"ghost"}>
                            <CalendarDays size={"15"}></CalendarDays>
                        </Button>

                        {
                            (JSON.parse(day) as string[]).map(d => (
                                <Badge variant={"secondary"}>{d}</Badge>
                            ))
                        }
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

function EditTaskDialog({ id, name, time, kind, content, day }: TaskCardProps) {
    const [tname, setName] = useState(name);
    const [tcontent, setContent] = useState(content);
    const [ttime, setTime] = useState(time);

    const [selectedDays, setSelectedDays] = useState<string[]>(JSON.parse(day))

    async function edit_task() {
        await invoke("update_task", {
            name: tname,
            time: ttime,
            kind: kind,
            content: tcontent,
            day: JSON.stringify(selectedDays),
            id: id
        })
    }
    const chipStyle = `
  rounded-full px-4 py-1 border
  data-[state=on]:bg-primary
  data-[state=on]:text-white
  data-[state=on]:border-primary
  dark:data-[state=on]:text-black
`
    async function chooseFile() {
        const file = await open({
            multiple: false,
            filters: [
                { name: 'Executables', extensions: ['exe', 'msi', 'app', 'bat', 'sh'] },
                { name: 'All Files', extensions: ['*'] }
            ]
        });
        if (file) {
            setContent(file)
        }
    }
    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    {/* <Button variant="outline">Open Dialog</Button> */}

                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}><Pencil></Pencil> Edit</DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <div className="flex items-center">
                            <DialogTitle>Edit</DialogTitle>
                            <Badge variant="outline" className="ml-2">
                                {kind}
                            </Badge>
                        </div>

                    </DialogHeader>
                    <div className="flex gap-2 items-center">
                        Title:
                        <Input value={tname}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter text" />
                    </div>
                    {
                        kind == "executable" ?
                            <div className="flex gap-2 items-center">
                                <Button size={"icon"} onClick={chooseFile}>
                                    <Folder></Folder>
                                </Button>
                                <Input value={tcontent}
                                    onChange={(e) => setContent(e.target.value)} placeholder="Enter text" />
                            </div>
                            : <div>
                                <p className="mb-1">Command:</p>
                                <div className="flex gap-2 items-center">
                                    <Textarea
                                        value={tcontent}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Enter Command"
                                    />
                                </div>
                            </div>
                    }
                    <div className="flex justify-center">

                        <ToggleGroup type="multiple" variant="outline" value={selectedDays} onValueChange={setSelectedDays}>
                            {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map(day => (
                                <ToggleGroupItem key={day} value={day} className={chipStyle}>
                                    {day}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>
                    </div>
                    <Separator></Separator>
                    <div className="flex gap-2 items-center">

                        <p className="font-bold">Schedule:</p>
                        <Input
                            type="time"
                            value={ttime}
                            onChange={(e) => setTime(e.target.value)}
                            id="time-picker-optional"
                            step="1" />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" onClick={edit_task}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}

function DeleteTaskDialog({ id }: { id: number }) {

    async function delete_task() {
        await invoke("delete_task", { id: id })
    }
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
                            Are you sure you want to delete this task? {id}
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={delete_task} type="submit" variant={"destructive"}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}


function AddCommand() {
    const [name, setName] = useState("");
    const [content, setContent] = useState("");
    const [time, setTime] = useState("00:00:00");
    async function add_task() {
        await invoke("add_task", {
            name: name,
            time: time,
            kind: "command",
            content: content,
            day: JSON.stringify(selectedDays)
        })
    }
    const chipStyle = `
  rounded-full px-4 py-1 border
  data-[state=on]:bg-primary
  data-[state=on]:text-white
  data-[state=on]:border-primary
  dark:data-[state=on]:text-black
`
    const [selectedDays, setSelectedDays] = useState<string[]>([])

    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>

                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}><Terminal></Terminal>Command</DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <div className="flex items-center">
                            <DialogTitle>Add Command</DialogTitle>
                        </div>

                    </DialogHeader>
                    <div className="flex gap-2 items-center">
                        Title:
                        <Input value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter text" />
                    </div>
                    <p>Command:</p>
                    <div className="flex gap-2 items-center">
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Enter Command"
                        />
                    </div>
                    <Separator></Separator>
                    <div className="flex gap-2 items-center">

                        <p className="font-bold">Schedule:</p>
                        <Input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            id="time-picker-optional"
                            step="1" />
                    </div>
                    <div className="flex justify-center">

                        <ToggleGroup type="multiple" variant="outline" value={selectedDays} onValueChange={setSelectedDays}>
                            {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map(day => (
                                <ToggleGroupItem key={day} value={day} className={chipStyle}>
                                    {day}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" onClick={add_task}><Plus></Plus>Add</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
function AddExecutable() {
    const [name, setName] = useState("");
    const [content, setContent] = useState("");
    const [time, setTime] = useState("00:00:00");
    const [selectedDays, setSelectedDays] = useState<string[]>([])
    async function add_task() {
        await invoke("add_task", { name: name, time: time, kind: "executable", content: content, day: JSON.stringify(selectedDays) })
    }
    const chipStyle = `
  rounded-full px-4 py-1 border
  data-[state=on]:bg-primary
  data-[state=on]:text-white
  data-[state=on]:border-primary
  dark:data-[state=on]:text-black
`
    async function chooseFile() {
        const file = await open({
            multiple: false,
            filters: [
                { name: 'Executables', extensions: ['exe', 'msi', 'app', 'bat', 'sh'] },
                { name: 'All Files', extensions: ['*'] }
            ]
        });
        if (file) {
            setContent(file)
        }
    }

    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>

                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}><AppWindow></AppWindow>Executable</DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <div className="flex items-center">
                            <DialogTitle>Add Executable</DialogTitle>
                        </div>

                    </DialogHeader>
                    <div className="flex gap-2 items-center">
                        Title:
                        <Input value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter text" />
                    </div>
                    <div className="flex gap-2 items-center">
                        <Button size={"icon"} onClick={chooseFile}>
                            <Folder></Folder>
                        </Button>
                        <Input value={content}
                            onChange={(e) => setContent(e.target.value)} placeholder="Enter Location" />
                    </div>
                    <Separator></Separator>
                    <div className="flex gap-2 items-center">

                        <p className="font-bold">Schedule:</p>
                        <Input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            id="time-picker-optional"
                            step="1" />
                    </div>
                    <div className="flex justify-center">

                        <ToggleGroup type="multiple" variant="outline" value={selectedDays} onValueChange={setSelectedDays}>
                            {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map(day => (
                                <ToggleGroupItem key={day} value={day} className={chipStyle}>
                                    {day}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={add_task} type="submit"><Plus></Plus>Add</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}

export { MoreInfoDialog, EditTaskDialog, DeleteTaskDialog, AddCommand, AddExecutable };