import { io } from "/socket.io/socket.io.esm.min.js";
import { createApp } from "/vue/vue.esm-browser.js";
import Home from "./components/home.js";
import Join from "./components/join.js";
import Waiting from "./components/waiting.js";

const socket = io();
const states = [
	"home", "join", "waiting",
	"countdown", "active",
	"gameover", "score"
];

createApp( {
	components: {
		Home,
		Join,
		Waiting
	},
	data() {
		return {
			state: "home",
			playerName: "",
			id: 0
		};
	},
	methods: {
		showJoin() {
			this.state = "join";
		},
		registerPlayer( playerName ) {
			this.playerName = playerName;
			socket.emit( "join-game", {
				playerName
			}, res => {
				this.id = res.id;
				this.state = "waiting";
				console.log( "received ack from server:", res );
			} );
		}
	},
	created() {
		socket.connect();

		socket.on( "state", state => {
			console.log( state );
			this.state = state;
		} );
	},
	template: `
	<Home v-if="state === 'home'" @join="showJoin" />
	<Join v-if="state === 'join'" @registerPlayer="registerPlayer" />
	<Waiting v-if="state === 'waiting'" :playerName="playerName" :id="id" />
	`
} ).mount( "#app" );
