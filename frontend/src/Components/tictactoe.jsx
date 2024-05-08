import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ACTIONS from "../action";
import { initSocket } from "./Socket";
import "react-toastify/dist/ReactToastify.css";
import "../Styles/tictactoe.css";

const TicTacToe = () => {
  const socketRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const roomId = location.state?.roomId;
  const [clients, setClients] = useState([]);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [currentPlayer, setCurrentPlayer] = useState(true);

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
          // console.log(`${username} joined the room`);
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

  const handleClick = (index) => {
    if(clients.length <2 || !clients[0]?.username || !clients[1]?.username) return;
    // Check if it's the current player's turn
    if ((currentPlayer && location.state.username !== clients[0]?.username) ||
        (!currentPlayer && location.state.username !== clients[1]?.username)) {
      return; // If not, return and do nothing
    }
  
    const newBoard = [...board];
    if (newBoard[index] || calculateWinner(newBoard)) {
      return;
    }
    newBoard[index] = currentPlayer ? "X" : "O";
    setBoard(newBoard);
    setXIsNext(!xIsNext);
    // Toggle currentPlayer after each move
    setCurrentPlayer(!currentPlayer);
    socketRef.current.emit(ACTIONS.UPDATE_GAME, { roomId, data: newBoard });
    socketRef.current.emit(ACTIONS.CHANGE_PLAYER, {roomId, data: !currentPlayer })
  };
  
  const renderSquare = (index) => (
    <div className="smallsquare1" onClick={() => handleClick(index)}>
      {board[index]}
    </div>
  );

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  const isBoardFull = () => {
    return board.every((square) => square !== null);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    socketRef.current.emit(ACTIONS.UPDATE_GAME, {
      roomId,
      data: Array(9).fill(null),
    });
  };

  const copyRoomIdToClipboard = () => {
    navigator.clipboard.writeText(roomId);
    toast.success("Room ID copied to clipboard!");
  };

  const winner = calculateWinner(board);
  let status;

  // Check if clients array has at least two elements and if their username properties are defined
  if (clients.length >= 2 && clients[0]?.username && clients[1]?.username) {
    if (winner) {
      status = `Winner: ${
      winner === "X" ? clients[0].username : clients[1].username
      }`;
    }else if (isBoardFull()) {
    status = "It's a Draw!";
  } else {
    // setXIsNext(!xIsNext);
    status = `Next player: ${
      currentPlayer ? clients[0]?.username : clients[1]?.username
    }`;
  }
} else {
  status = "Waiting for players to join...";
}

  if (!localStorage.getItem("user")) {
    return <div>Please log in to access this page</div>;
  }
  if (!localStorage.getItem("roomId")) {
    return <div>Please get a room ID to access this page</div>;
  }

  return (
    <div className="main1">
      <ToastContainer />
      <div className="top-container">
        <div className="flex space-x-6">
          <div className="info-left">Room ID: {roomId}</div>
          <button onClick={copyRoomIdToClipboard} className="btn-copy">
            Copy
          </button>
        </div>
        <div>
          {clients
            .filter((client, index, array) => {
              // Filter to include only unique usernames
              return (
                array.findIndex((c) => c.username === client.username) === index
              );
            })
            .map((client, index) => (
              <div key={client.socketId} className="info-right">
                Player {index + 1}: {client.username}
              </div>
            ))}
        </div>
      </div>
      <div className="title1">Let's Play Tic Tac Toe</div>
      <div className="mainsqaure1">
        <div className="row1">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="row1">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="row1">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>
      <div className="status1">{status}</div>
      <button className="btn1" onClick={resetGame}>
        Reset
      </button>
    </div>
  );
};

export default TicTacToe;

// if (clients.length >= 2 && clients[0]?.username && clients[1]?.username) {
//   if (winner) {
//     status = `Winner: ${
//       winner === "X" ? clients[0].username : clients[1].username
//     }`;
//   } else if (isBoardFull()) {
//     status = "It's a Draw!";
//   } else {
//     status = `Next player: ${
//       xIsNext ? clients[0].username : clients[1].username
//     }`;
//   }
// } else {
//   status = "Waiting for players to join...";
// }


// handleClick ke starting me

// if ((currentPlayer && location.state.username !== clients[0]?.username) ||
//         (!currentPlayer && location.state.username !== clients[1]?.username)) {
//       return; // If not, return and do nothing
//     }




