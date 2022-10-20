import { io } from "/socket.io/socket.io.esm.min.js";

const socket = io();
const states = [
	"home", "join", "waiting",
	"countdown", "active",
	"gameover", "score"
];

function hideAll() {
	for( const state of states ) {
		const el = document.getElementById( state );
		if ( el && !el.classList.contains( "hidden" ) ) {
			el.classList.add( "hidden" );
		}
	}
}

function showState( state ) {
	hideAll();
	const el = document.getElementById( state );
	if ( el ) {
		el.classList.remove( "hidden" );
	}
}

socket.on( "state", state => {
	console.log( state );
	showState( state );
} );

function start() {
	showState( "join" );
}

document.addEventListener( "DOMContentLoaded", () => {
	const startButton = document.getElementById( "startGame" );
	if ( startButton ) {
		startButton.addEventListener( "click", start );
	}
} );
