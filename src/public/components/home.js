export default {
	emits: [ "join" ],
	methods: {
		join() {
			this.$emit( "join" );
		}
	},
	template: `
	<h2 class="font-bold">Home</h2>
	<p class="my-4">Information about the game</p>
	<button class="bg-slate-400 rounded rounded-full p-3" @click="join">Start a new game</button>
`
};
