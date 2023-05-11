import { io } from "/socket.io/socket.io.esm.min.js";
import { createApp } from "/vue/vue.esm-browser.js";
import Home from "./components/home.js";
import Join from "./components/join.js";
import Waiting from "./components/waiting.js";
import Countdown from "./components/countdown.js";
import Quiz from "./components/quiz.js";
import GameOver from "./components/gameover.js";

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
		Waiting,
		Countdown,
		Quiz,
		GameOver
	},
	data() {
		return {
			state: "home",
			playerName: "",
			id: 0,
			countdown: 0,
			players: [],
			trivia: [],
			currentQuestion: 0,
			score: 0
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
		},
		answer( index ) {
			console.log( "player answered:", index );
			const data = {
				id: this.id,
				question: this.currentQuestion,
				answer: index,
				skipped: false
			};
			socket.emit( "answer", data, score => {
				this.score = score;
			} );
			this.currentQuestion++;
		},
		skip() {
			console.log( "player skipped" );
			const data = {
				id: this.id,
				question: this.currentQuestion,
				answer: -1,
				skipped: true
			};
			socket.emit( "answer", data, score => {
				this.score = score;
			} );
			this.currentQuestion++;
		}
	},
	created() {
		socket.connect();

		socket.on( "state", ( { state, players, countdown } ) => {
			console.log( state, players, countdown );
			this.state = state;
			this.players = players;
			this.countdown = countdown;
		} );

		socket.on( "trivia", ( trivia ) => {
			console.log( trivia );
			this.trivia = trivia;
		} );
	},
	template: `
	<h1 class="text-3xl font-bold text-center">AHOT Trivia Game</h1>
	<Home v-if="state === 'home'" @join="showJoin" />
	<Join v-if="state === 'join'" @registerPlayer="registerPlayer" />
	<Waiting v-if="state === 'waiting'" :playerName="playerName" :id="id" />
	<Countdown v-if="state === 'countdown'" :playerName="playerName" :id="id" :countdown="countdown" />
	<Quiz v-if="state === 'active'" :playerName="playerName" :id="id" :countdown="countdown" :score="score" :question="trivia[currentQuestion]" :currentQuestionId="currentQuestion" @answer="answer" @skip="skip" />
	<GameOver v-if="state === 'gameover'" :playerName="playerName" :id="id" :score="score" :players="players" @join="showJoin" />
	`
} ).mount( "#app" );
