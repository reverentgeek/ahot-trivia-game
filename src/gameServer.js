"use strict";

const quiz = require( "./quiz" );

const states = {
	home: "home",
	join: "join",
	waiting: "waiting",
	countdown: "countdown",
	active: "active",
	gameover: "gameover",
	score: "score"
};

function start( server ) {
	let state = states.home;
	let countdown;
	let countDownStart;
	const players = [];
	let trivia = [];

	function sendState( socket ) {
		const currentState = {
			state,
			countdown,
			players
		};
		if ( socket ) {
			return socket.emit( "state", currentState );
		}
		server.io.emit( "state", currentState );
	}

	function sendTrivia() {
		// TODO: remove answers
		// trivia.forEach( t => {
		// 	delete t.correct;
		// } );
		server.io.emit( "trivia", trivia );
	}

	function doTheCountdown() {
		countDownStart = Date.now();
		const interval = 1000;
		const totalSeconds = ( state === states.countdown ) ? 3 : 60;
		let stepCount = 0;

		const step = () => {
			const now = Date.now();
			stepCount++;
			const diff = now - countDownStart;
			const secondsPassed = Math.round( diff / 1000 );
			if ( ( totalSeconds - secondsPassed ) < 0 ) {
				countdown = 0;
				state = ( state === states.countdown ) ? states.active : states.gameover;
				if ( state === states.active ) {
					initGame();
				}
				return sendState();
			}
			countdown = totalSeconds - secondsPassed;
			sendState();
			const drift = diff - ( stepCount * interval );
			const timeout = interval - drift;
			setTimeout( step, timeout );
		};

		setTimeout( step, interval );
	}

	function initGame() {
		trivia = quiz.getRandomTrivia().slice( 0, 50 );
		console.log( trivia );
		console.log( trivia.length );
		sendTrivia();
	}

	function startGame() {
		state = states.countdown;
		countdown = 3;
		sendState();
		doTheCountdown();
	}

	// we need to wait for the server to be ready, else `server.io` is undefined
	server.io.on( "connection", ( socket ) => {
		socket.on( "join-game", ( { playerName }, callback ) => {
			console.log( "Server received 'join-game' from player:", playerName );
			const playerId = players.length + 1;
			const player = { id: playerId, name: playerName };
			callback( player );
			players.push( player );
			// TODO: Set the limit of the number of players?
			if ( players.length >= 2 ) {
				startGame();
			}
		} );

		console.log( "socket connection made", socket.id );
		sendState( socket );
	} );

}

module.exports = {
	start
};
