"use strict";

const trivia = require( "./trivia.json" );

function shuffleArray( array ) {
	for ( let i = array.length - 1; i > 0; i-- ) {
		const j = Math.floor( Math.random() * ( i + 1 ) );
		[ array[i], array[j] ] = [ array[j], array[i] ];
	}
	return array;
}

function getRandomTrivia() {
	return shuffleArray( trivia );
}

module.exports = {
	getRandomTrivia
};
