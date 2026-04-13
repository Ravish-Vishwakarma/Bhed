import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import CardMenuPopover from "./card-menu-popover"
import { Badge } from "./ui/badge"
export function TaskCard() {
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Title <Badge variant="outline" className="ml-2">Executable</Badge></CardTitle>
                <CardAction>
                    <CardMenuPopover></CardMenuPopover>
                </CardAction>
            </CardHeader>
            <CardContent>
                Next Trigger:
            </CardContent>
        </Card>
    )
}
