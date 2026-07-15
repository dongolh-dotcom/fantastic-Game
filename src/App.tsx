
import React, { useState } from "react";
import "./App.css";

import Snake from "./snake";
import MemoryGame from "./MemoryGame";

function App() {
  const [currentGame, setCurrentGame] = useState("snake");

  return (
    <div className="App">
      <h1>🎮 React Mini Games</h1>

      <div className="menu">
        <button onClick={() => setCurrentGame("snake")}>
          🐍 Snake
        </button>

        <button onClick={() => setCurrentGame("memory")}>
          🧠 Memory Match
        </button>
      </div>

      <div id="center">
        {currentGame === "snake" && <Snake />}
        {currentGame === "memory" && <MemoryGame />}
      </div>
    </div>
  );
}

export default App;
