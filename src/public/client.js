import { io } from "/socket.io/socket.io.esm.min.js";

const socket = io();
socket.on( "hello", msg => {
	console.log( msg );
} );
