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
import { useTasks } from "../lib/task-context";
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
                        <p className="break-all whitespace-pre-wrap max-w-full">{content}</p>
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
    const { refresh } = useTasks();
    const [tname, setName] = useState(name);
    const [tcontent, setContent] = useState(content);
    const [ttime, setTime] = useState(time);
    const [selectedDays, setSelectedDays] = useState<string[]>(JSON.parse(day));
    const [errors, setErrors] = useState<{ name?: string; content?: string; days?: string }>({});

    async function edit_task() {
        const newErrors: typeof errors = {};
        if (!tname.trim()) newErrors.name = "Title is required";
        if (!tcontent.trim()) newErrors.content = kind === "executable" ? "Executable path is required" : "Command is required";
        if (selectedDays.length === 0) newErrors.days = "Select at least one day";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        await invoke("update_task", {
            name: tname,
            time: ttime,
            kind,
            content: tcontent,
            day: JSON.stringify(selectedDays),
            id
        });
        refresh();
    }

    const chipStyle = `
        rounded-full px-4 py-1 border
        data-[state=on]:bg-primary
        data-[state=on]:text-white
        data-[state=on]:border-primary
        dark:data-[state=on]:text-black
    `;

    async function chooseFile() {
        const file = await open({
            multiple: false,
            filters: [
                { name: 'Executables', extensions: ['exe', 'msi', 'app', 'bat', 'sh'] },
                { name: 'All Files', extensions: ['*'] }
            ]
        });
        if (file) {
            setContent(file);
            setErrors(p => ({ ...p, content: undefined }));
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Pencil /> Edit
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <div className="flex items-center">
                        <DialogTitle>Edit</DialogTitle>
                        <Badge variant="outline" className="ml-2">{kind}</Badge>
                    </div>
                </DialogHeader>

                <div className="flex gap-2 items-center">
                    Title:
                    <div className="flex flex-col w-full">
                        <Input
                            value={tname}
                            onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })); }}
                            placeholder="Enter text"
                        />
                        {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                    </div>
                </div>

                {kind === "executable" ? (
                    <div className="flex flex-col gap-1">
                        <div className="flex gap-2 items-center">
                            <Button size="icon" onClick={chooseFile}>
                                <Folder />
                            </Button>
                            <Input
                                value={tcontent}
                                onChange={(e) => { setContent(e.target.value); setErrors(p => ({ ...p, content: undefined })); }}
                                placeholder="Enter Location"
                            />
                        </div>
                        {errors.content && <p className="text-destructive text-xs">{errors.content}</p>}
                    </div>
                ) : (
                    <div className="flex flex-col gap-1">
                        <p>Command:</p>
                        <Textarea
                            value={tcontent}
                            onChange={(e) => { setContent(e.target.value); setErrors(p => ({ ...p, content: undefined })); }}
                            placeholder="Enter Command"
                            className="break-all whitespace-pre-wrap"
                        />
                        {errors.content && <p className="text-destructive text-xs">{errors.content}</p>}
                    </div>
                )}

                <div className="flex flex-col items-center gap-1">
                    <ToggleGroup type="multiple" variant="outline" value={selectedDays}
                        onValueChange={(v) => { setSelectedDays(v); setErrors(p => ({ ...p, days: undefined })); }}>
                        {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map(day => (
                            <ToggleGroupItem key={day} value={day} className={chipStyle}>
                                {day}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                    {errors.days && <p className="text-destructive text-xs">{errors.days}</p>}
                </div>

                <Separator />

                <div className="flex gap-2 items-center">
                    <p className="font-bold">Schedule:</p>
                    <Input
                        type="time"
                        value={ttime}
                        onChange={(e) => setTime(e.target.value)}
                        step="1"
                    />
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button onClick={edit_task} type="button">Save changes</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function DeleteTaskDialog({ id }: { id: number }) {
    const { refresh } = useTasks();

    async function delete_task() {
        await invoke("delete_task", { id: id });
        refresh();
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
                            Are you sure you want to delete this task?
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
    const { refresh } = useTasks();
    const [name, setName] = useState("");
    const [content, setContent] = useState("");
    const [time, setTime] = useState("00:00:00");
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [errors, setErrors] = useState<{ name?: string; content?: string; days?: string }>({});

    async function add_task() {
        const newErrors: typeof errors = {};
        if (!name.trim()) newErrors.name = "Title is required";
        if (!content.trim()) newErrors.content = "Command is required";
        if (selectedDays.length === 0) newErrors.days = "Select at least one day";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        await invoke("add_task", {
            name,
            time,
            kind: "command",
            content,
            day: JSON.stringify(selectedDays),
        });
        refresh();
    }

    const chipStyle = `
        rounded-full px-4 py-1 border
        data-[state=on]:bg-primary
        data-[state=on]:text-white
        data-[state=on]:border-primary
        dark:data-[state=on]:text-black
    `;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Terminal /> Command
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Add Command</DialogTitle>
                </DialogHeader>

                <div className="flex gap-2 items-center">
                    Title:
                    <div className="flex flex-col w-full">
                        <Input
                            value={name}
                            onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })); }}
                            placeholder="Enter text"
                        />
                        {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                    </div>
                </div>

                <p>Command:</p>
                <div className="flex flex-col gap-1">
                    <Textarea
                        value={content}
                        onChange={(e) => { setContent(e.target.value); setErrors(p => ({ ...p, content: undefined })); }}
                        placeholder="Enter Command"
                        className="break-all whitespace-pre-wrap"
                    />
                    {errors.content && <p className="text-destructive text-xs">{errors.content}</p>}
                </div>

                <Separator />

                <div className="flex gap-2 items-center">
                    <p className="font-bold">Schedule:</p>
                    <Input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        step="1"
                    />
                </div>

                <div className="flex flex-col items-center gap-1">
                    <ToggleGroup type="multiple" variant="outline" value={selectedDays}
                        onValueChange={(v) => { setSelectedDays(v); setErrors(p => ({ ...p, days: undefined })); }}>
                        {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map(day => (
                            <ToggleGroupItem key={day} value={day} className={chipStyle}>
                                {day}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                    {errors.days && <p className="text-destructive text-xs">{errors.days}</p>}
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button onClick={add_task} type="button"><Plus /> Add</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function AddExecutable() {
    const { refresh } = useTasks();
    const [name, setName] = useState("");
    const [content, setContent] = useState("");
    const [time, setTime] = useState("00:00:00");
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [errors, setErrors] = useState<{ name?: string; content?: string; days?: string }>({});

    async function add_task() {
        const newErrors: typeof errors = {};
        if (!name.trim()) newErrors.name = "Title is required";
        if (!content.trim()) newErrors.content = "Executable path is required";
        if (selectedDays.length === 0) newErrors.days = "Select at least one day";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        await invoke("add_task", { name, time, kind: "executable", content, day: JSON.stringify(selectedDays) });
        refresh();
    }

    const chipStyle = `
        rounded-full px-4 py-1 border
        data-[state=on]:bg-primary
        data-[state=on]:text-white
        data-[state=on]:border-primary
        dark:data-[state=on]:text-black
    `;

    async function chooseFile() {
        const file = await open({
            multiple: false,
            filters: [
                { name: 'Executables', extensions: ['exe', 'msi', 'app', 'bat', 'sh'] },
                { name: 'All Files', extensions: ['*'] }
            ]
        });
        if (file) {
            setContent(file);
            setErrors(p => ({ ...p, content: undefined }));
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <AppWindow /> Executable
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Add Executable</DialogTitle>
                </DialogHeader>

                <div className="flex gap-2 items-center">
                    Title:
                    <div className="flex flex-col w-full">
                        <Input
                            value={name}
                            onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })); }}
                            placeholder="Enter text"
                        />
                        {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <div className="flex gap-2 items-center">
                        <Button size="icon" onClick={chooseFile}>
                            <Folder />
                        </Button>
                        <Input
                            value={content}
                            onChange={(e) => { setContent(e.target.value); setErrors(p => ({ ...p, content: undefined })); }}
                            placeholder="Enter Location"
                        />
                    </div>
                    {errors.content && <p className="text-destructive text-xs">{errors.content}</p>}
                </div>

                <Separator />

                <div className="flex gap-2 items-center">
                    <p className="font-bold">Schedule:</p>
                    <Input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        step="1"
                    />
                </div>

                <div className="flex flex-col items-center gap-1">
                    <ToggleGroup type="multiple" variant="outline" value={selectedDays}
                        onValueChange={(v) => { setSelectedDays(v); setErrors(p => ({ ...p, days: undefined })); }}>
                        {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map(day => (
                            <ToggleGroupItem key={day} value={day} className={chipStyle}>
                                {day}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                    {errors.days && <p className="text-destructive text-xs">{errors.days}</p>}
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button onClick={add_task} type="button"><Plus /> Add</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export { MoreInfoDialog, EditTaskDialog, DeleteTaskDialog, AddCommand, AddExecutable };