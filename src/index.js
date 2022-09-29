"use strict";

// Require the framework and instantiate it
const fastify = require( "fastify" )( { logger: true } );
const fastifyIO = require( "fastify-socket.io" );
const fastifyStatic = require( "@fastify/static" );
const path = require( "path" );

// Register the socket.io plugin
fastify.register( fastifyIO );

// Register the static file plugin
const publicPath = path.join( __dirname, "public" );
console.log( "publicPath:", publicPath );
fastify.register( fastifyStatic, {
	root: publicPath,
	prefix: "/", // optional: default '/'
} );

// Declare a route
fastify.get( "/", async ( request, reply ) => {
	fastify.io.emit( "hello" );
	return { hey: "y'all!" };
} );

fastify.ready().then( () => {
	// we need to wait for the server to be ready, else `server.io` is undefined
	fastify.io.on( "connection", ( socket ) => {
		console.log( "socket connection made" );
		// fastify.log.info
	} );
} );

// Run the server!
const start = async () => {
	try {
		await fastify.listen( { port: 3000 } );
	} catch ( err ) {
		fastify.log.error( err );
		process.exit( 1 );
	}
};
start();
