import { X, Minus, Square, Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '@/lib/theme-provider';
import { AddNewTask } from './add-new-task';
import { Separator } from './ui/separator';
import { getCurrentWindow } from "@tauri-apps/api/window";

function Header() {
    const appWindow = getCurrentWindow();
    const { theme, toggleTheme } = useTheme();
    return (
        <header className="h-10 w-full border-b bg-background/80 backdrop-blur">
            <div className="flex h-full items-center justify-between px-2">
                <h1 className="text-[18px] font-medium tracking-tight">
                    BHED
                </h1>

                <div className="flex items-center">
                    <AddNewTask></AddNewTask>
                    <Button variant={"secondary"} size="icon" className="mr-2" onClick={toggleTheme}>
                        {theme === "light" ? <Moon /> : <Sun />}
                    </Button>
                    <Separator orientation="vertical" className="hidden md:block" />
                    <Button onClick={() => appWindow.minimize()} variant={"ghost"} size="icon">
                        <Minus></Minus>
                    </Button>
                    <Button onClick={() => appWindow.toggleMaximize()} variant={"ghost"} size="icon">
                        <Square></Square>
                    </Button>
                    <Button onClick={() => appWindow.hide()} variant={"ghost"} size="icon">
                        <X></X>
                    </Button>
                </div>
            </div>
        </header>
    )
}

export default Header