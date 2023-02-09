"use strict";

// Require the framework and instantiate it
const fastify = require( "fastify" );
const fastifySession = require( "@fastify/session" );
const fastifyCookie = require( "@fastify/cookie" );
const fastifyIO = require( "fastify-socket.io" );
const fastifyStatic = require( "@fastify/static" );
const path = require( "path" );

const dotenv = require( "dotenv" );
dotenv.config();

const {
	PORT: port,
	HOST: host,
	SESSION_SECRET: sessionSecret,
	HTTPS_ENABLED: secure
} = process.env;

const gameServer = require( "./gameServer" );

// Path to views folder
const views = path.join( __dirname, "views" );

// Create the Fastify server
const server = fastify( { logger: true } );

// Register Session/cookie
server.register( fastifyCookie );
const sessionStore = new fastifySession.MemoryStore;
const sessionOptions = { store: sessionStore, secret: sessionSecret, cookie: { secure } };
server.register( fastifySession,  sessionOptions );
server.addHook( "preHandler", ( request, reply, next ) => {
	// console.log( "request.session:", request.session );
	// Todo: figure out how to load a user from storage and populate the session.user
	request.session.user = { name: "max" };
	next();
} );

// Register the socket.io plugin
server.register( fastifyIO );

// Register the static file plugin
const publicPath = path.join( __dirname, "..", "public" );
server.register( fastifyStatic, {
	root: publicPath
} );

// Serve vue.js static files
const vuePath = path.join( __dirname, "..", "node_modules", "vue", "dist" );
server.register( fastifyStatic, {
	root: vuePath,
	prefix: "/vue/",
	decorateReply: false // there can be only one!
	// reply decorator has been added by the first plugin registration
} );

// Serve fonts
const fontPath = path.join( __dirname, "..", "node_modules", "@fontsource", "montserrat", "files" );
server.register( fastifyStatic, {
	root: fontPath,
	prefix: "/files/",
	decorateReply: false // there can be only one!
	// reply decorator has been added by the first plugin registration
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
		// creating the options object
		const options = { port, host };
		await server.listen( options );
	} catch ( err ) {
		server.log.error( err );
		process.exit( 1 );
	}
};
start();
