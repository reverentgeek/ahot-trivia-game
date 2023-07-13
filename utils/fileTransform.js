"use strict";
const fs = require( "fs-extra" );
const path = require( "node:path" );
const { stringify } = require( "csv-stringify" );
const { parse } = require( "csv-parse/sync" );

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

async function transformJsonToCSV( jsonData ) {
	return new Promise( ( resolve, reject ) => {
		const flattenedJson = jsonData.map( j => {
			return {
				question: j.question,
				choice1: j.choices[0].choice,
				choice2: j.choices[1].choice,
				choice3: j.choices[2].choice,
				choice4: j.choices[3].choice
			};
		} );

		stringify( flattenedJson, {
			header: true,
			columns: [ { key: "question", header: "Question" },
				{ key: "choice1", header: "Correct Choice" },
				{ key: "choice2", header: "Alternate" },
				{ key: "choice3", header: "Alternate" },
				{ key: "choice4", header: "Alternate" } ]
		}, function( err, data ) {
			if ( err ) {
				return reject( err );
			}
			return resolve( data );
		} );
	} );

}

async function transformCSVtoJson( csvFile ) {
	const csvData = await fs.readFile( csvFile, { encoding: "utf8" } );
	const records = parse( csvData, {
		columns: true,
		skip_empty_lines: true
	} );
	const questions = records.map( r => {
		return {
			question: r.Question,
			choices: [
				{ choice: r["Correct Choice"] },
				{ choice: r.Alternate1 },
				{ choice: r.Alternate2 },
				{ choice: r.Alternate3 }
			],
			correct: 0
		};
	} );
	return questions;
}

async function main() {
	const textFile = path.join( __dirname, "trivia.txt" );
	const jsonFile = path.join( __dirname, "trivia.json" );
	const updatedJsonFile = path.join( __dirname, "trivia-from-csv.json" );
	const csvFile = path.join( __dirname, "trivia.csv" );
	const importCsvFile = path.join( __dirname, "Computer Trivia Questions - Sheet1.csv" );
	const triviaData = await readAndParseTriviaText( textFile );
	await fs.writeJSON( jsonFile, triviaData, { spaces: 2 } );
	const csvData = await transformJsonToCSV( triviaData );
	await fs.writeFile( csvFile, csvData );
	const importedTriviaData = await transformCSVtoJson( importCsvFile );
	await fs.writeJSON( updatedJsonFile, importedTriviaData, { spaces: 2 } );
	// console.log( importedTriviaData );
	// console.log( csvData );
	// console.log( triviaData );
}

main().then( () => console.log( "finished." ) );
