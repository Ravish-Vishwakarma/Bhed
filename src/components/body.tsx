import { TaskCard } from "./task-card"
import { invoke } from '@tauri-apps/api/core';
import { useEffect, useState } from "react";


function Body() {
    type Task = {
        id: number;
        name: string;
        time: string;
        kind: string;
        content: string;
        day: string;
    };
    const [tasks, setTasks] = useState<Task[]>([]);
    useEffect(() => {
        async function read_tasks() {
            const response = await invoke<Task[]>("read_task");
            setTasks(response);
        }

        read_tasks();
    }, []);
    return (
        <div>

            {tasks.length === 0 ? (
                <p className="flex justify-center">No tasks yet</p>
            ) : (
                <div className="m-2 grid grid-cols-3 gap-3">
                    {tasks.map((task) => (
                        <TaskCard
                            id={task.id}
                            name={task.name}
                            time={task.time}
                            kind={task.kind}
                            content={task.content}
                            day={task.day}
                        />
                    ))}
                </div>
            )

            }

        </div>
    );
}

export default Body