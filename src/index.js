"use strict";

// Require the framework and instantiate it
const fastify = require( "fastify" );
const fastifyIO = require( "fastify-socket.io" );
const fastifyStatic = require( "@fastify/static" );
const path = require( "path" );

const dotenv = require( "dotenv" );
dotenv.config();

const gameServer = require( "./gameServer" );

// Path to views folder
const views = path.join( __dirname, "views" );

// Create the Fastify server
const server = fastify( { logger: true } );

// Register the socket.io plugin
server.register( fastifyIO );

// Register the static file plugin
const publicPath = path.join( __dirname, "..", "public" );
server.register( fastifyStatic, {
	root: publicPath
} );

// Declare a route
server.get( "/", async ( request, reply ) => {
	return reply.sendFile( "index.html", views );
} );

server.ready().then( () => {
	gameServer.start( server );
} );

// Run the server!
const start = async () => {
	try {
		const { PORT: port, HOST: host } = process.env;
		const options = { port, host };
		await server.listen( options );
	} catch ( err ) {
		server.log.error( err );
		process.exit( 1 );
	}
};
start();
