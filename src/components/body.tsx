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
        <div className="m-2 grid grid-cols-3 gap-3">
            {tasks.length === 0 ? (
                <p>No tasks yet</p>
            ) : (
                tasks.map((task) => (
                    <TaskCard
                        id={task.id}
                        name={task.name}
                        time={task.time}
                        kind={task.kind}
                        content={task.content}
                    />
                ))
            )}
        </div>
    );
}

export default Body