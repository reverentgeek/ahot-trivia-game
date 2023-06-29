"use strict";
const fs = require( "fs-extra" );
const path = require( "path" );

function randomChoice( choices ) {
	return Math.floor( Math.random() * ( choices ) );
}

function generateRandomQuestions( numberOfQuestions ) {
	let questions = [];
	for( let i = 0; i < numberOfQuestions; i++ ) {
		const question = {
			question: `Mock trivia question number ${ ( i + 1 ) }`,
			choices: []
		};
		if ( ( i % 3 ) === 0 ) {
			question.choices.push( { choice: "True" } );
			question.choices.push( { choice: "False" } );
		} else {
			for( let j = 0; j < 4; j++ ) {
				question.choices.push( { choice: `Choice ${ ( j + 1 ) }` } );
			}
		}
		question.correct = randomChoice( question.choices.length );
		questions.push( question );
	}
	return questions;
}

const questions = generateRandomQuestions( 200 );
const triviaFile = path.join( __dirname, "mockTrivia.json" );

fs.writeJSON( triviaFile, questions, { spaces: 2 } ).then( console.log( "finished." ) );
