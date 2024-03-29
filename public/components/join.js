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
	mounted() {
		this.$refs.playerName.focus();
	},
	template: `
	<h2 class="font-bold text-xl mt-4 text-center">Join</h2>
	<p class="my-4">Enter your name to join.</p>
	<input ref="playerName" class="p-3 border-orange-300 rounded-full border-2 w-full" id="player-name" v-model="playerName" v-on:keyup.enter="join" autocomplete="off" placeholder="GamerName" required />
	<button class="bg-green-300 rounded rounded-full py-3 px-6 object-center mt-2" @click="join">Next</button>
	`
};
