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

const COUNTDOWN_DEFAULT = 3;
const GAME_TIME_DEFAULT = 60;

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
		const clientTrivia = JSON.parse( JSON.stringify( trivia ) );
		clientTrivia.forEach( t => {
			delete t.correct;
		} );
		server.io.emit( "trivia", clientTrivia );
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
		countdown = GAME_TIME_DEFAULT;
		doTheCountdown( GAME_TIME_DEFAULT, endGame );
		sendState();
	}

	function updatePlayerRank() {
		players.sort( ( p1, p2 ) => {
			return p2.score - p1.score;
		} );
		let lastRank = 1;
		let lastScore = players[0].score;
		players[0].rank = lastRank;
		for( let i = 0; i < players.length; i++ ) {
			if ( players[i].score === lastScore ) {
				players[i].rank = lastRank;
			} else {
				lastRank++;
				lastScore = players[i].score;
				players[i].rank = lastRank;
			}
		}
	}

	function startGame() {
		server.log.info( { event: "game-start" } );
		state = states.countdown;
		countdown = COUNTDOWN_DEFAULT;
		sendState();
		doTheCountdown( COUNTDOWN_DEFAULT, initGame );
	}

	function endGame() {
		server.log.info( { event: "game-over" } );
		state = states.gameover;
		updatePlayerRank();
		sendState();
	}

	// we need to wait for the server to be ready, else `server.io` is undefined
	server.io.on( "connection", ( socket ) => {
		socket.on( "join-game", ( { playerName }, callback ) => {
			server.log.info( { event: "join-game", playerName } );
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
				server.log.info( { event: "answer", id, question, answer, skipped, score: player.score, name: player.name } );
				ack( player.score );
			}
		} );

		server.log.info( { event: "connection", id: socket.id } );
		sendState( socket );
	} );

}

module.exports = {
	start
};
