import "./App.css";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import React from "react";
import Home from "./Components/Dashboard";
import Games from "./Components/games";
import About from "./Components/About";
import Tictactoe from "./Components/tictactoe";
import Memory from "./Components/memory";
import Guessgame from "./Components/guessgame";
import Connectfourdisc from "./Components/connectfourdisc";
import JoinGame from "./Components/Joingame";
import Login from "./Components/Login";
import Signup from "./Components/Signup";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/about" element={<About />} />
          <Route path="/games/joingame/:gamename" element={<JoinGame />} />
          {/* <Route path="/games/:id/joingame" element={<JoinGame />} />
          <Route path="/games/:id/joingame" element={<JoinGame />} /> */}
          <Route path="/games/tictactoe" element={<Tictactoe />} />
          <Route path="/games/memorygame" element={<Memory />} />
          <Route path="/games/guessgame" element={<Guessgame />} />
          <Route path="/games/connectfourdisc" element={<Connectfourdisc />} />
          <Route path="/games/login" element={<Login />} />
          <Route path="/games/Signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
