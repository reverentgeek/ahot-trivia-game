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
	const state = states.home;
	const players = [];

	function sendState( socket ) {
		if ( socket ) {
			return socket.emit( "state", state );
		}
		server.io.emit( "state", state );
	}

	// we need to wait for the server to be ready, else `server.io` is undefined
	server.io.on( "connection", ( socket ) => {
		socket.on( "join-game", ( { playerName } ) => {
			console.log( "Server received 'join-game' from player:", playerName );
		} );

		console.log( "socket connection made", socket.id );
		sendState( socket );
	} );

}

module.exports = {
	start
};
