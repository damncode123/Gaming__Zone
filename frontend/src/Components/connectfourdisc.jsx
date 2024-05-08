import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import red from "../Assests/reddisc.png";
import black from "../Assests/blackdisc.png";
import "../Styles/connectfourdots.css";
import ACTIONS from "../action";
import { initSocket } from "./Socket";

const ConnectFourDisc = () => {
  const socketRef = useRef();
  const reactNavigator = useNavigate();
  const location = useLocation();
  const [clients, setClients] = useState([]);
  const roomId = location.state?.roomId;

  const [winner, setWinner] = useState(null);
  const [board, setBoard] = useState(Array.from({ length: 7 }, () => Array(7).fill("")));
  const [currentPlayer, setCurrentPlayer] = useState(true);
  const [gameOver, setGameOver] = useState(false);

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
          // toast.success(`${username} joined the room`);
        }
        setClients(clients);
      });

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        // toast.success(`${username} left the room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
      socketRef.current.on(ACTIONS.GAME_UPDATED, ({ data: board }) => {
        setBoard(board);
      });
      socketRef.current.on(ACTIONS.PLAYER_CHANGED, ({data: currentPlayer}) => {
        setCurrentPlayer(currentPlayer)
      })
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

  const handleMove = (column) => {
    if(clients.length <2 || !clients[0]?.username || !clients[1]?.username) 
      {
        return;
      }

    if ((currentPlayer && location.state.username !== clients[0]?.username) ||
        (!currentPlayer && location.state.username !== clients[1]?.username)) {
      return; // If not, return and do nothing
    }
    if (gameOver) return;

    const newBoard = board.map((row) => [...row]);
    const row = findEmptyRow(newBoard, column);

    if (row !== -1) {
      newBoard[row][column] = currentPlayer ? "X" : "O";
      setBoard(newBoard);
      checkWinner(newBoard, row, column);
      setCurrentPlayer(!currentPlayer);
    }
    socketRef.current.emit(ACTIONS.UPDATE_GAME, { roomId, data: newBoard });
    socketRef.current.emit(ACTIONS.CHANGE_PLAYER, {roomId, data: !currentPlayer})
  };

  const findEmptyRow = (board, column) => {
    for (let i = 6; i >= 0; i--) {
      if (board[i][column] === "") {
        return i;
      }
    }
    return -1;
  };

  const checkWinner = (board, row, column) => {
    const directions = [
      [0, 1], // Horizontal
      [1, 0], // Vertical
      [1, 1], // Diagonal /
      [1, -1], // Diagonal \
    ];

    for (const [dr, dc] of directions) {
      let count = 1; // Count of consecutive discs
      count += countDirection(board, row, column, dr, dc); // Check in one direction
      count += countDirection(board, row, column, -dr, -dc); // Check in opposite direction

      if (count >= 4) {
        setGameOver(true);
        setWinner(currentPlayer ? "X" : "O");
        return;
      }
    }

    if (isBoardFull(board)) {
      setGameOver(true);
      setWinner("Draw");
    }
  };

  const countDirection = (board, row, column, dr, dc) => {
    const player = board[row][column];
    let count = 0;
    let r = row + dr;
    let c = column + dc;

    while (r >= 0 && r < 7 && c >= 0 && c < 7 && board[r][c] === player) {
      count++;
      r += dr;
      c += dc;
    }

    return count;
  };

  const isBoardFull = (board) => {
    return board.every((row) => row.every((cell) => cell !== ""));
  };

  const resetGame = () => {
    setWinner(null);
    setBoard(Array.from({ length: 7 }, () => Array(7).fill("")));
    setGameOver(false);
    socketRef.current.emit(ACTIONS.UPDATE_GAME, {
      roomId,
      data: Array.from({ length: 7 }, () => Array(7).fill("")),
    });
  };

  if (!localStorage.getItem("user")) {
    return <div>Please log in to access this page</div>;
  }
  if (!localStorage.getItem("roomId")) {
    return <div>Please get a room ID to access this page</div>;
  }

  return (
    <div className="mainc">
      <ToastContainer />
      <div className="top-container1">
        <div className="flex space-x-6">
          <div className="info-left1">Room ID : {roomId}</div>
          <button onClick={copyRoomIdToClipboard} className="btn-copy1">
            Copy
          </button>
        </div>
        <div>
          {clients
            .filter((client, index, array) => {
              return (
                array.findIndex((c) => c.username === client.username) === index
              );
            })
            .map((client, index) => (
              <div key={client.socketId} className="info-right1">
                Player {index + 1}: {client.username}
              </div>
            ))}
        </div>
      </div>
      <div className="title">It's time for Connecting Four Disc</div>
      <div className="board">
        {board.map((row, i) => (
          <div key={i} className="row">
            {row.map((ch, j) => (
              <div key={j} className="slot" onClick={() => handleMove(j)}>
                {ch && (
                  <img
                    src={ch === "X" ? red : black}
                    alt={ch}
                    className="img"
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="status">
        {gameOver ? (
          <div className="game-over-message">
            {winner === "Draw" ? (
              "It's a draw!"
            ) : (
              <span>
                Player{" "}
                {winner === "X" ? clients[0]?.username : clients[1]?.username} wins!
              </span>
            )}
          </div>
        ) : (
          <div className="next-player-message">
            {clients.length >= 2 && clients[0]?.username && clients[1]?.username ? (
              <span>Next player: {currentPlayer ? clients[0]?.username : clients[1]?.username}</span>
            ) : (
              <span>Waiting for players to join...</span>
            )}
          </div>
        )}
      </div>
      <button className="btn2" onClick={resetGame}>
        Reset
      </button>
    </div>
  );
};

export default ConnectFourDisc;
