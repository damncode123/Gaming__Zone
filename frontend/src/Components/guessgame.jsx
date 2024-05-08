import React, { useState } from 'react';
// import { useLocation } from "react-router-dom";

function GuessGame() {
  // const location = useLocation();
  const [randomNumber, setRandomNumber] = useState(generateRandomNumber());
  const [attempts, setAttempts] = useState(7);
  const [message, setMessage] = useState('');
  const [guess, setGuess] = useState('');
  const maxAttempts = 7;

  function generateRandomNumber() {
    return Math.floor(Math.random() * 10) + 1;
  }

  const handleInputChange = (e) => {
    setGuess(e.target.value);
    setMessage('');
  };

  const handleGuess = () => {
    if (guess === '') {
      setMessage('Please enter a number first.');
      return;
    }
    if (attempts === 0) {
      resetGame();
    } else {
      setAttempts(attempts - 1);

      if (parseInt(guess, 10) === randomNumber) {
        setMessage(`🎉 Congratulations! You guessed it right in ${maxAttempts-attempts} attempts.`);
      } else if (parseInt(guess, 10) > randomNumber) {
        setMessage(`Too high. ${attempts-1} attempts left, try again.`);
      } else if (parseInt(guess, 10) < randomNumber) {
        setMessage(`Too low. ${attempts-1} attempts left, try again.`);
      }

      if (attempts === 0) {
        setMessage(`😞 Sorry, you've reached the maximum number of attempts. The correct number was ${randomNumber}.`);
      }
    }
  };

  const resetGame = () => {
    setRandomNumber(generateRandomNumber());
    setAttempts(7);
    setMessage('');
    setGuess('');
  };

  // If user is not authenticated, render a message or redirect
  if (!localStorage.getItem('user')) {
    return <div>Please log in to access this page</div>;
  }

  return (
    <div className='flex justify-center items-center bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 min-h-screen'>
      <div className='text-center w-6/12 h-min bg-white bg-opacity-90 border border-solid border-gray-300 p-6 rounded-md space-y-8 shadow-lg'>
        <h1 className='font-bold text-4xl text-indigo-600 mb-4'>GUESS GAME</h1>
        <div className='font-semibold text-lg mb-4 text-gray-700'>
          Enter your guessed number between 1 and 100. You have {attempts} attempts left.
        </div>
        <div>
          <input
            type="text"
            className='border border-solid border-gray-400 w-6/12 h-12 rounded-md text-center focus:outline-none focus:ring focus:border-indigo-300'
            value={guess}
            onChange={handleInputChange}
          />
        </div>
        <button
          onClick={handleGuess}
          className={`mt-6 px-8 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none focus:ring focus:border-indigo-300 cursor-pointer`}
          disabled={!guess}
        >
          Check Guess
        </button>
        <p className='text-red-500 font-semibold mt-4'>{message}</p>
      </div>
    </div>
  );
}

export default GuessGame;
