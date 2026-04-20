import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { invoke } from "@tauri-apps/api/core";

type Task = {
    id: number;
    name: string;
    time: string;
    kind: string;
    content: string;
    day: string;
};

type TaskContextType = {
    tasks: Task[];
    refresh: () => Promise<void>;
};

const TaskContext = createContext<TaskContextType | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
    const [tasks, setTasks] = useState<Task[]>([]);

    async function refresh() {
        const response = await invoke<Task[]>("read_task");
        setTasks(response);
    }

    useEffect(() => {
        refresh();
    }, []);

    return (
        <TaskContext.Provider value={{ tasks, refresh }}>
            {children}
        </TaskContext.Provider>
    );
}

export function useTasks() {
    const context = useContext(TaskContext);
    if (!context) throw new Error("useTasks must be used within TaskProvider");
    return context;
}