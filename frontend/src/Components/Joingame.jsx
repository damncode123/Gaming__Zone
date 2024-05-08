import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Styles/joingame.css";

const GameEntryForm = () => {
  const navigate = useNavigate();
  const { gamename } = useParams();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const handleEnterGame = () => {
    if (roomId && username) {
      // Both Room ID and username are present
      console.log(username)
      localStorage.setItem("roomId", roomId); // Store roomId in localStorage
      navigate(`/games/${gamename}`, {
        state: { username, roomId },
      });
    } else {
      // Display an alert or handle the scenario where either Room ID or username is missing
      alert("Please enter both Room ID and username to join the game.");
      // You can also add additional logic here to handle this scenario
    }
  };

  const handleRoomid = (e) => {
    setRoomId(e.target.value);
  };

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  // If user is not authenticated, render a message or redirect
  if (!localStorage.getItem("user")) {
    return <div>Please log in to access this page</div>;
  }

  return (
    <div className="bg-image">
      <div className="w-80 rounded-2xl bg-slate-900 justify-center">
        <div className="flex flex-col gap-5 p-8">
          <p className="text-center text-3xl text-gray-300 mb-4">Join Game</p>
          <input
            onChange={handleRoomid}
            className="bg-slate-900 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-800 text-white"
            placeholder="Room_ID"
          />
          <input
            onChange={handleUsername}
            className="bg-slate-900 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-800 text-white"
            placeholder="Username"
          />
          <button
            onClick={handleEnterGame}
            className="inline-block cursor-pointer rounded-md bg-gray-700 px-4 py-3.5 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2 active:scale-95"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameEntryForm;
