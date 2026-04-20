import "./App.css";
import Header from "./components/app-bar";
import Body from "./components/body";
import { TaskProvider } from "./lib/task-context";

function App() {
  return (
    <TaskProvider>
      <main>
        <Header></Header>
        <Body></Body>
      </main>
    </TaskProvider>
  );
}

export default App;