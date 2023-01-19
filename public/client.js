import { io } from "/socket.io/socket.io.esm.min.js";
import { createApp } from "/vue/vue.esm-browser.js";
import Home from "./components/home.js";
import Join from "./components/join.js";

const socket = io();
const states = [
	"home", "join", "waiting",
	"countdown", "active",
	"gameover", "score"
];

createApp( {
	components: {
		Home,
		Join
	},
	data() {
		return {
			state: "home",
			playerName: ""
		};
	},
	methods: {
		showJoin() {
			this.state = "join";
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
	<Join v-if="state === 'join'" />
	`
} ).mount( "#app" );
