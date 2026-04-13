// import { useState } from "react";
// import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import Header from "./components/app-bar";
import Body from "./components/body";

function App() {
  // const [greetMsg, setGreetMsg] = useState("");
  // const [name, setName] = useState("");

  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  //   setGreetMsg(await invoke("greet", { name }));
  // }

  return (
    <main >
      <Header></Header>
      <Body></Body>
    </main>
  );
}

export default App;
