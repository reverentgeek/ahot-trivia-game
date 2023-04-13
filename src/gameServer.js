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
	let players = [];
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

	function doTheCountdown( totalSeconds, callback ) {
		countDownStart = Date.now();
		const interval = 1000;
		let stepCount = 0;

		const step = () => {
			const now = Date.now();
			stepCount++;
			const diff = now - countDownStart;
			const secondsPassed = Math.round( diff / 1000 );
			if ( ( totalSeconds - secondsPassed ) < 0 ) {
				countdown = 0;
				return callback();
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
		state = states.active;
		trivia = quiz.getRandomTrivia().slice( 0, 50 );
		sendTrivia();
		countdown = 60;
		doTheCountdown( 60, endGame );
		sendState();
	}

	function startGame() {
		state = states.countdown;
		countdown = 3;
		sendState();
		doTheCountdown( 3, initGame );
	}

	function endGame() {
		console.log( "game over" );
		state = states.gameover;
		sendState();
	}

	// we need to wait for the server to be ready, else `server.io` is undefined
	server.io.on( "connection", ( socket ) => {
		socket.on( "join-game", ( { playerName }, callback ) => {
			console.log( "Server received 'join-game' from player:", playerName );
			const playerId = players.length + 1;
			const player = { id: playerId, name: playerName, score: 0, answers: [] };
			callback( player );
			players.push( player );
			// TODO: Set the limit of the number of players?
			if ( players.length >= 2 ) {
				startGame();
			}
		} );

		socket.on( "answer", ( { id, question, answer, skipped }, ack ) => {
			const answerTime = Date.now();
			const player = players.find( p => p.id === id );
			if ( player ) {
				const correct = trivia[question].correct === answer;
				player.answers.push( {
					question,
					answer,
					skipped,
					answerTime,
					correct
				} );
				// const totalQuestions = player.answers.length;
				const totalCorrect = player.answers.filter( a => a.correct ).length;
				const totalIncorrect = player.answers.filter( a => a.correct === false && a.skipped === false ).length;
				const totalSkipped = player.answers.filter( a => a.skipped ).length;
				const score = ( totalCorrect * 100 )
					- ( totalSkipped * 25 )
					- ( totalIncorrect * 50 );
				player.score = score > 0 ? score : 0;
				// Todo: calculate score
				console.log( player );
				// send score back to the client
				ack( player.score );
			}
		} );

		console.log( "socket connection made", socket.id );
		sendState( socket );
	} );

}

module.exports = {
	start
};
