export default {
	props: {
		id: Number,
		playerName: String,
		score: Number
	},
	emits: [ "join" ],
	methods: {
		join() {
			this.$emit( "join" );
		}
	},
	template: `
	<h2>Game Over!</h2>
	<div>{{ playerName }}</div>
	<div>Your score: {{ score }}</div>
	<button class="bg-slate-400 rounded rounded-full p-3" @click="join">Start a new game</button>
`
};
