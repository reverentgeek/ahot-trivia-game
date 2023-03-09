"use strict";
const fs = require( "fs-extra" );
const path = require( "path" );

function generateRandomQuestions( numberOfQuestions ) {
	let questions = [];
	for( let i = 0; i < numberOfQuestions; i++ ) {
		const question = {
			question: `Mock trivia question number ${ ( i + 1 ) }`,
			choices: []
		};
		if ( ( i % 3 ) === 0 ) {
			question.choices.push( { choice: "True", correct: true } );
			question.choices.push( { choice: "False", correct: false } );
		} else {
			for( let j = 0; j < 4; j++ ) {
				question.choices.push( { choice: `Choice ${ ( j + 1 ) }`, correct: false } );
			}
			question.choices[3].correct = true;
		}
		questions.push( question );
	}
	return questions;
}

const questions = generateRandomQuestions( 200 );
const triviaFile = path.join( __dirname, "mockTrivia.json" );
// console.log( triviaFile );
fs.writeJSON( triviaFile, questions, { spaces: 2 } ).then( console.log( "finished." ) );
