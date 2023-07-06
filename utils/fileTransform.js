"use strict";
const fs = require( "fs-extra" );
const path = require( "node:path" );

async function readAndParseTriviaText( fileName ) {
	const text = await fs.readFile( fileName, { encoding: "utf-8" } );
	const lines = text.split( "\n" );
	const questions = [];
	let i = 0;
	while( i < lines.length ) {
		const slice = lines.slice( i, i + 5 );
		const question = slice[0];
		const choices = [];
		for( let j = 1; j < slice.length; j++ ) {
			choices.push( { choice: slice[j].substring( 3 ) } );
		}
		questions.push( {
			question,
			choices,
			correct: 0
		} );
		i += 6;
	}
	return questions;
}

async function transfromJsonToCSV( jsonData ) {

}

async function main() {
	const textFile = path.join( __dirname, "trivia.txt" );
	const jsonFile = path.join( __dirname, "trivia.json" );
	const triviaData = await readAndParseTriviaText( textFile );
	await fs.writeJSON( jsonFile, triviaData, { spaces: 2 } );
	// console.log( triviaData );
}

main().then( () => console.log( "finished." ) );
