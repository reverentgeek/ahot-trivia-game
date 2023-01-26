export default {
	emits: [ "registerPlayer" ],
	data() {
		return {
			playerName: ""
		};
	},
	methods: {
		join() {
			this.$emit( "registerPlayer", this.playerName );
		}
	},
	template: `<h2>Join</h2>
	<p>Enter your name to join.</p>
	<input class="p-3 border-indigo-700 rounded-full border-2" id="player-name" v-model="playerName" autocomplete="off" placeholder="GamerName" required />
	<button class="rounded-full p-3 font-semibold bg-indigo-300" @click="join">Next</button>
	`
};
