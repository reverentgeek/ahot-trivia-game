"use strict";

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
	const players = [];

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

	function doTheCountdown() {
		setTimeout( () => {
			countdown--;
			if ( countdown === 0 ) {
				state = state.active;
			}
			sendState();
			if ( countdown > 0 ) {
				doTheCountdown();
			}
		}, 1000 );
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
