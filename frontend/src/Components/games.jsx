import React from "react";
// import { useParams } from "react-router-dom"; 
import game1 from "../Assests/tictactoe.png";
import { Card, CardHeader, CardBody, CardFooter, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Games() {
   if (!localStorage.getItem('user')) {
    return <div>Please log in to access this page</div>;
  }
  return (
    <div className="min-h-screen w-full h-48">
      <div className="bg-cyan-100 space-y-6">
        <div className="text-center p-4 flex space-x-40 items-center justify-center">
          <Card className="mt-6 w-96  order border-blue-500 rounded-xl">
            <CardHeader color="blue-gray" className="relative h-56">
              <div className="flex justify-center items-center">
                <img className="h-56 w-56" src={game1} alt="card-image" />
              </div>
            </CardHeader>
            <CardBody>
              <Typography variant="h-5" color="blue-gray" className="mb-1 mt-1">
                <h1 className="text-4xl font-bold">TIC-TAC-TOE</h1>
              </Typography>
              <Typography>
                <div className="text-2xl font-semibold">Key Features:</div>
                1. Two players take turns.
                <br />
                2. 3x3 grid with X and O symbols.
                <br />
                3. Objective: Form a line of three symbols.
              </Typography>
            </CardBody>
            <CardFooter className="pt-0">
              <button className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300">
              <Link to={`/games/joingame/tictactoe`}>Play Now</Link>
              </button>
            </CardFooter>
          </Card>
          <Card className="mt-6 w-96  order border-blue-500 rounded-xl">
            <CardHeader color="blue-gray" className="relative h-56">
              <div className="flex justify-center items-center">
                <img
                  className="h-56 w-56"
                  src="https://img.freepik.com/free-vector/hand-drawn-memory-game-cards_23-2150119764.jpg?size=626&ext=jpg&uid=R82592556&ga=GA1.1.160631793.1697163941&semt=ais"
                  alt="card-image"
                />
              </div>
            </CardHeader>
            <CardBody>
              <Typography variant="h-5" color="blue-gray" className="mb-2 mt-3">
                <h1 className="text-4xl font-bold">Memory Game</h1>
              </Typography>
              <Typography>
                <div className="text-2xl font-semibold">Key Features:</div>
                1. Deck of face-down cards.
                <br />
                2. Players flip two cards per turn to find matching pairs.
                <br />
              </Typography>
            </CardBody>
            <CardFooter className="pt-0">
              <button className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300">
              <Link to={`/games/joingame/memorygame`}>Play Now</Link>
              </button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <div className="bg-cyan-100 space-y-6">
        <div className="text-center p-4 flex space-x-40 items-center justify-center">
          <Card className="mt-6 w-96  order border-blue-500 rounded-xl">
            <CardHeader color="blue-gray" className="relative h-56">
              <div className="flex justify-center items-center">
                <img
                  className="h-56 w-56"
                  src="https://img.freepik.com/free-vector/hand-drawn-flat-design-hopscotch-game_23-2149296649.jpg?size=626&ext=jpg&uid=R82592556&ga=GA1.1.160631793.1697163941&semt=ais"
                  alt="card-image"
                />
              </div>
            </CardHeader>
            <CardBody>
              <Typography variant="h-5" color="blue-gray" className="mb-2 mt-3">
                <h1 className="text-4xl font-bold">Guess Number</h1>
              </Typography>
              <Typography>
                <div className="text-2xl font-semibold">Key Features:</div>
                1. Randomly generated target number.
                <br />
                2. Player makes guesses 0-100.
                <br />
                3. Feedback after each guess to indicate incorrect or correct.
              </Typography>
            </CardBody>
            <CardFooter className="pt-0">
              <button className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300">
                <Link to="/games/guessgame">Play Now</Link>
              </button>
            </CardFooter>
          </Card>
          <Card className="mt-6 w-96  order border-blue-500 rounded-xl">
            <CardHeader color="blue-gray" className="relative h-56">
              <div className="flex justify-center items-center">
                <img
                  className="h-56 w-56"
                  src="https://store-images.s-microsoft.com/image/apps.24885.13728199301590089.51d11a1b-2138-4af9-a706-93599ead034f.9e2a2bac-4703-46b5-aadd-8ec941c71ed4?mode=scale&q=90&h=300&w=300"
                  alt="card-image"
                />
              </div>
            </CardHeader>
            <CardBody>
              <Typography variant="h-5" color="blue-gray" className="mb-2 mt-3">
                <h1 className="text-4xl font-bold">Connect Four disc</h1>
              </Typography>
              <Typography>
                <div className="text-2xl font-semibold">Key Features:</div>
                1. Two players take turns dropping colored discs.
                <br />
                2. nxm grid for gameplay.
                <br />
                3. Objective: Connect four discs in a row.
              </Typography>
            </CardBody>
            <CardFooter className="pt-0">
              <button className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300">
              <Link to={`/games/joingame/connectfourdisc`}>Play Now</Link> 
              </button>
            </CardFooter>
          </Card>
        </div>
        <div className="flex justify-center items-center">
          <button className="mt-6 px-8 py-3 mb-5 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300">
            <Link to="/">Back to Home</Link>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Games;
