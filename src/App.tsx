import { useState } from "react";
import "./App.css";
import Snake from "./snake";
import MemoryGame from "./MemoryGame";

function App() {
  const [game, setGame] = useState("snake");

  return (
    <section id="center">
      <div className="menu">
        <button onClick={() => setGame("snake")}>
          🐍 Snake
        </button>

        <button onClick={() => setGame("memory")}>
          🧠 Memory Match
        </button>
      </div>

      {game === "snake" && <Snake />}
      {game === "memory" && <MemoryGame />}
    </section>
  );
}

export default App;
