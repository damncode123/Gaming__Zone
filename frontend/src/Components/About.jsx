import React from 'react'
import { Link } from 'react-router-dom';
function About() {
  return (
    <div className="min-h-screen bg-cyan-100 flex items-center justify-center">
      <div className="text-center p-8">
  <h1 class="text-4xl font-bold mb-6">GameZone - Your Ultimate Gaming Destination</h1>
  <p class="text-lg text-gray-700 mb-8">
    Welcome to GameZone, where the thrill of gaming meets endless fun! Immerse yourself in a world of entertainment with our curated collection of four exciting games, each designed to challenge your skills, engage your mind, and provide hours of enjoyment.
  </p>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-4">1. Tic-Tac-Toe</h2>
      <p class="text-gray-700">
        Embark on a classic journey with our timeless Tic-Tac-Toe game. Whether you're challenging a friend or honing your strategy against the computer, this age-old favorite promises intense battles and strategic showdowns. Will you be the unbeatable champion of the grid?
      </p>
    </div>
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-4">2. Memory Game</h2>
      <p class="text-gray-700">
      Welcome to the Memory Game – a classic and entertaining challenge for your mind! Immerse yourself in the world of memory and concentration as you put your cognitive skills to the test. This game is designed to sharpen your memory, enhance focus, and provide hours of fun.      </p>
    </div>
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-4">3. GuessNumber</h2>
      <p class="text-gray-700">
        Challenge your mind with GuessNumber, a game of logic and deduction. Sharpen your number-crunching skills as you attempt to guess the hidden sequence. With each guess, refine your strategy and inch closer to cracking the code. Are you up for the challenge?
      </p>
    </div>
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-4">4. Connect Four</h2>
      <p class="text-gray-700">
        Engage in a battle of wits with Connect Four, a timeless strategy game. Drop your colored discs strategically and aim to connect four of them in a row. Outsmart your opponent and claim victory in this classic game of skill and tactics.
      </p>
    </div>
  </div>

  <p class="mt-8 text-lg text-gray-700">
    At GameZone, our mission is to provide a diverse gaming experience that caters to players of all ages. Whether you're a seasoned gamer or just looking for some casual fun, our collection of games promises entertainment for everyone. Get ready to embark on a gaming adventure like never before!
  </p>
  <button class="mt-6 px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300">
    <Link to='/'>Back to Home</Link>
  </button>
</div>

</div>
  )
}

export default About
