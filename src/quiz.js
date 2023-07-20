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
	const shuffledTrivia = shuffleArray( trivia );
	shuffledTrivia.forEach( t => {
		t.choices[t.correct].correct = true;
		t.choices = shuffleArray( t.choices );
		t.correct = t.choices.findIndex( c => c.correct === true );
		delete t.choices[t.correct].correct;
	} );
	return shuffledTrivia;
	// return shuffleArray( trivia );
}

module.exports = {
	getRandomTrivia
};
