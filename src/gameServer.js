"use strict";

const crypto = require( "crypto" );

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

	const randomId = () => crypto.randomBytes( 8 ).toString( "hex" );

	function sendState( socket ) {
		if ( socket ) {
			return socket.emit( "state", state );
		}
		server.io.emit( "state", state );
	}

	// server.io.on( "connect", ( socket ) => {
	// 	console.log( "connect event?", socket.handshake.auth );
	// } );

	// we need to wait for the server to be ready, else `server.io` is undefined
	server.io.on( "connection", ( socket ) => {

		console.log( "socket connection", socket.id, socket.handshake.auth );
		// console.log( "socket connection made", socket.handshake.auth );
		console.log( "headers", socket.handshake.headers );
		const sid = server.parseCookie( socket.handshake.headers.cookie ).sessionId;
		console.log( "sid", sid );
		// let req = {};
		// app.decryptSession( sid, req, () => {
		// 	console.log( req.session );
		// 	// You can basically access req.session here
		// } );

		const sessionId = socket.handshake.auth.sessionId;
		if ( sessionId ) {
			// restore the session
		} else {
			socket.sessionId = randomId();
			console.log( "sessionId:", socket.sessionId );
		}

		socket.on( "join-game", ( { playerName } ) => {
			console.log( "Server received 'join-game' from player:", playerName );
		} );

		sendState( socket );
	} );

}

module.exports = {
	start
};
