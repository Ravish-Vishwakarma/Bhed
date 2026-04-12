import { X, Minus, Square, Sun } from 'lucide-react';
import { Button } from './ui/button';

function Header() {
    return (
        <header className="h-10 w-full border-b bg-background/80 backdrop-blur">
            <div className="flex h-full items-center justify-between px-2">
                <h1 className="text-[18px] font-medium tracking-tight">
                    BHED
                </h1>

                <div>
                    <Button variant={"secondary"} size="icon" className="mr-2">
                        <Sun></Sun>
                    </Button>

                    <Button variant={"ghost"} size="icon">
                        <Minus></Minus>
                    </Button>
                    <Button variant={"ghost"} size="icon">
                        <Square></Square>
                    </Button>
                    <Button variant={"ghost"} size="icon">
                        <X></X>
                    </Button>
                </div>
            </div>
        </header>
    )

}
export default Header