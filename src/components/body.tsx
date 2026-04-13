import { TaskCard } from "./task-card"

function Body() {
    return <div className="m-2 gap-3 flex">
        <TaskCard></TaskCard>
        <TaskCard></TaskCard>
    </div>
}

export default Body