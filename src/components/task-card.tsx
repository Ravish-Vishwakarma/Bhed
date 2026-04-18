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
};

export function TaskCard({ id, name, time, kind, content }: TaskCardProps) {
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
                    />
                </CardAction>
            </CardHeader>
            <CardContent>
                Next Trigger: {time}
            </CardContent>
        </Card>
    );
}
