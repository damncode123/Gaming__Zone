import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import mem1 from "../Assests/memoryimage1.png";
import mem2 from "../Assests/memoryimage2.png";
import mem3 from "../Assests/memoryimage3.png";
import mem4 from "../Assests/memoryimage4.png";
import mem5 from "../Assests/memoryimage5.png";
import mem6 from "../Assests/memoryimage6.png";
import mem7 from "../Assests/memoryimage7.png";
import mem8 from "../Assests/memoryimage8.png";
import mem9 from "../Assests/memoryimage9.png";
import mem10 from "../Assests/memoryimage10.png";
import "../Styles/memorygame.css";
import ACTIONS from "../action";
import { initSocket } from "./Socket";

function Memory() {
  const reactNavigator = useNavigate();
  const socketRef = useRef(null);
  const [clients, setClients] = useState([]);
  const location = useLocation();
  const roomId = location.state?.roomId;
  const [currentPlayer, setCurrentPlayer] = useState(true);
  const [count, setcount] = useState(0);
  const [items, setItems] = useState(
    [
      { id: 1, img: mem1, stat: "normal" },
      { id: 1, img: mem1, stat: "normal" },
      { id: 2, img: mem2, stat: "normal" },
      { id: 2, img: mem2, stat: "normal" },
      { id: 3, img: mem3, stat: "normal" },
      { id: 3, img: mem3, stat: "normal" },
      { id: 4, img: mem4, stat: "normal" },
      { id: 4, img: mem4, stat: "normal" },
      { id: 5, img: mem5, stat: "normal" },
      { id: 5, img: mem5, stat: "normal" },
      { id: 6, img: mem6, stat: "normal" },
      { id: 6, img: mem6, stat: "normal" },
      { id: 7, img: mem7, stat: "normal" },
      { id: 7, img: mem7, stat: "normal" },
      { id: 8, img: mem8, stat: "normal" },
      { id: 8, img: mem8, stat: "normal" },
      { id: 9, img: mem9, stat: "normal" },
      { id: 9, img: mem9, stat: "normal" },
      { id: 10, img: mem10, stat: "normal" },
      { id: 10, img: mem10, stat: "normal" },
    ].sort(() => Math.random() - 0.5)
  );

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("Socket error", e);
        toast.error("Socket connection failed, try again later.");
        reactNavigator("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      socketRef.current.on(ACTIONS.JOINED, ({ clients, username }) => {
        if (username !== location.state?.username) {
          console.log(`${username} joined the room`);
          toast.success(`${username} joined the room`);
        }
        setClients(clients);
      });

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
      socketRef.current.on(ACTIONS.GAME_UPDATED, ({ data: items }) => {
        setItems(items);
      });
      socketRef.current.on(ACTIONS.PLAYER_CHANGED, ({ data: currentPlayer }) => {
        setCurrentPlayer(currentPlayer);
      });
      socketRef.current.on(
        ACTIONS.SCORE_UPDATED,
        ({ player1Score, player2Score }) => {
          setPlayer1Score(player1Score);
          setPlayer2Score(player2Score);
        }
      );
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
        socketRef.current.disconnect();
      }
    };
  }, []);

  const copyRoomIdToClipboard = () => {
    navigator.clipboard.writeText(roomId);
    toast.success("Room ID copied to clipboard!", {
      style: { fontSize: "14px" },
    });
  };

  const [prev, setPrev] = useState(-1);
  const [cnt, setCnt] = useState(0);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [res, setRes] = useState("");

  const isGameOver = () => {
    return items.every((item) => item.stat === "matched");
  };

  const handleClick = (id, index) => {
    if(clients.length <2 || !clients[0]?.username || !clients[1]?.username) 
      {
        return;
      }

    if ((currentPlayer && location.state.username !== clients[0]?.username) ||
        (!currentPlayer && location.state.username !== clients[1]?.username)) {
      return; // If not, return and do nothing
    }
    const newItems = [...items];

    if (
      newItems[index].stat === "flipped" ||
      newItems[index].stat === "matched"
    ) {
      return;
    }

    newItems[index].stat = "flipped";

    if (prev !== -1 && newItems[prev].id === id) {
      newItems[index].stat = "matched";
      newItems[prev].stat = "matched";
      setPrev(-1);
      if (currentPlayer) {
        setPlayer1Score(player1Score + 1);
        socketRef.current.emit(ACTIONS.UPDATE_SCORE, {
          roomId,
          player1Score: player1Score + 1,
          player2Score,
        });
      } else {
        setPlayer2Score(player2Score + 1);
        socketRef.current.emit(ACTIONS.UPDATE_SCORE, {
          roomId,
          player1Score,
          player2Score: player2Score + 1,
        });
      }
    } else if (prev !== -1) {
      setTimeout(() => {
        newItems[index].stat = "normal";
        newItems[prev].stat = "normal";
        setItems(newItems);
        setPrev(-1);
        // Player switch only when the current player has flipped two cards
        setCurrentPlayer(!currentPlayer);
        socketRef.current.emit(ACTIONS.CHANGE_PLAYER, {
          roomId,
          data: !currentPlayer,
        });
        socketRef.current.emit(ACTIONS.UPDATE_GAME, { roomId, data: newItems });
      }, 500);
    } else {
      setPrev(index);
    }

    setItems(newItems);
    setCnt(cnt + 1);

    if (isGameOver() && clients.size() >= 2) {
      const result = `Player ${
        player1Score > player2Score
          ? clients[0]?.username
          : clients[1]?.username
      } wins with ${Math.max(player1Score, player2Score)} points`;
      setRes(result);
    }
    socketRef.current.emit(ACTIONS.UPDATE_GAME, { roomId, data: newItems });
  };

  const renderSquare = (index) => (
    <div
      className={items[index].stat}
      onClick={() => handleClick(items[index].id, index)}
    >
      <img src={items[index].img} alt="" />
    </div>
  );

  const shuffleItems = () => {
    const updatedItems = items.map((item) => ({ ...item, stat: "normal" }));
    const shuffledItems = updatedItems.sort(() => Math.random() - 0.5);
    setItems(shuffledItems);
    setCnt(0);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setRes("");
    socketRef.current.emit(ACTIONS.UPDATE_GAME, {
      roomId,
      data: shuffledItems,
    });
  };
  
  // If user is not authenticated, render a message or redirect
  if (!localStorage.getItem("user")) {
    return <div>Please log in to access this page</div>;
  }
  if (!localStorage.getItem("roomId")) {
    return <div>Please get a room ID to access this page</div>;
  }
  return (
    <div className="main">
      <ToastContainer />
      <div className="top-container2">
        <div className="flex space-x-6">
          <div className="info-left2">Room ID : {roomId}</div>
          <button onClick={copyRoomIdToClipboard} className="btn-copy2">
            Copy
          </button>
        </div>
        <div className="username">
          {clients
            .filter((client, index, array) => {
              // Filter to include only unique usernames
              return (
                array.findIndex((c) => c.username === client.username) === index
              );
            })
            .map((client, index) => (
              <div className="info-right2" key={client.socketId}>
                {client.username} : {index === 0 ? player1Score : player2Score}
              </div>
            ))}
        </div>
      </div>
      <div className="title">Let's Play Memory Game</div>
      <div className="mainsqaure">
        <div className="roww">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
          {renderSquare(3)}
        </div>
        <div className="roww">
          {renderSquare(4)}
          {renderSquare(5)}
          {renderSquare(6)}
          {renderSquare(7)}
        </div>
        <div className="roww">
          {renderSquare(8)}
          {renderSquare(9)}
          {renderSquare(10)}
          {renderSquare(11)}
        </div>
        <div className="roww">
          {renderSquare(12)}
          {renderSquare(13)}
          {renderSquare(14)}
          {renderSquare(15)}
        </div>
        <div className="roww">
          {renderSquare(16)}
          {renderSquare(17)}
          {renderSquare(18)}
          {renderSquare(19)}
        </div>
      </div>
      <div className="status2">
        {/* {currentPlayer === 1 ? clients[0]?.username : clients[1]?.username} */}
        {clients.length >= 2 && clients[0]?.username && clients[1]?.username ? (
              <span>Next player: {currentPlayer ? clients[0]?.username : clients[1]?.username}</span>
            ) : (
              <span>Waiting for players to join...</span>
            )}
      </div>

      <div className="res">{res}</div>
      <button className="btn" onClick={shuffleItems}>
        Reset
      </button>
    </div>
  );
}

export default Memory;
