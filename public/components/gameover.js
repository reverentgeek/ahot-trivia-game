export default {
	props: {
		id: {
			type: Number,
			required: true
		},
		playerName: String,
		score: Number,
		players: Array
	},
	emits: [ "join" ],
	methods: {
		join() {
			this.$emit( "join" );
		}
	},
	computed: {
		otherPlayers() {
			this.players.filter( p => p.id !== this.id );
		},
		rank() {
			return this.players.find( p => p.id === this.id ).rank;
		},
		winner() {
			return this.rank === 1;
		}
	},
	template: `
	<h2>Game Over!</h2>
	<div>{{ playerName }}</div>
	<div v-if="winner" class="text-3xl">You won!</div>
	<div v-if="!winner" class="text-3xl">Better luck next time!</div>
	<div>Your score: {{ score }}</div>
	<button class="bg-slate-400 rounded rounded-full p-3" @click="join">Start a new game</button>
`
};
