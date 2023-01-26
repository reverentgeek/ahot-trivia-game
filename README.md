# Trivia Game

All Hands On Tech Live multi-player trivia game built with Node.js, FastifyJS, and Socket.io!

## Dependencies

* [Node.js LTS](https://nodejs.org) (currently 16+)
* Hint: Use [nvm](https://github.com/nvm-sh/nvm) to manage your versions of Node.js

## Setup

* Clone or download/unzip the source code
* Run `npm install` to install dependencies
* Make a copy of `.env.sample` and rename it to `.env`
* Make any changes to `.env`
* Run `npm run dev` to start the application
* Open your browser and navigate to `http://localhost:8080` (use the port specified in your `.env`)

## Tasks

[x] Configure Fastify and Socket.io
[x] Define game states
[x] Show/hide HTML based on game states
[x] Add Vue and Tailwind CSS to the project
[x] Setup Tailwind configuration and build process
[x] Introduce Vue.js, show/hide components based game states
[x] Allow player to enter a name and join the game
[ ] First player can start the game
[ ] Game starting countdown timer
[ ] Game timer
[ ] Randomize questions
[ ] Automatically stop the game when time is up or when all players have answered all questions
[ ] Calculate the winner
[ ] Reset game

## Game States

1. Welcome/home
1. Join
1. Waiting for other players to join
1. Pre-game countdown
1. Game play
1. Game over
1. Game results / scoreboard
