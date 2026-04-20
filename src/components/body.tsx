import { TaskCard } from "./task-card"
import { useTasks } from "../lib/task-context";

function Body() {
    const { tasks } = useTasks();

    return (
        <div>
            {tasks.length === 0 ? (
                <p className="flex justify-center">No tasks yet</p>
            ) : (
                <div className="m-2 grid grid-cols-3 gap-3">
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            id={task.id}
                            name={task.name}
                            time={task.time}
                            kind={task.kind}
                            content={task.content}
                            day={task.day}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Body