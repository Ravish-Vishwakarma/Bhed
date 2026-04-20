import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import CardMenuPopover from "./card-menu-popover"
import { Badge } from "./ui/badge"

type TaskCardProps = {
    id: number;
    name: string;
    time: string;
    kind: string;
    content: string;
    day: string;
};

export function TaskCard({ id, name, time, kind, content, day }: TaskCardProps) {
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>
                    {name}
                    <Badge variant="outline" className="ml-2">
                        {kind}
                    </Badge>
                </CardTitle>
                <CardAction>
                    <CardMenuPopover
                        id={id}
                        name={name}
                        time={time}
                        kind={kind}
                        content={content}
                        day={day}
                    />
                </CardAction>
            </CardHeader>
            <CardContent>
                Trigger At: {time}
            </CardContent>
        </Card>
    );
}
