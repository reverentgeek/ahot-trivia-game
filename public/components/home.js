export default {
	emits: [ "join" ],
	methods: {
		join() {
			this.$emit( "join" );
		}
	},
	template: `
	<div class="container flex flex-col items-center">
		<h2 class="font-bold text-xl my-4 text-center animate-wiggle">Welcome!</h2>
		<p class="my-4 border-solid border-orange-600 bg-orange-300 p-6">Test your knowledge against other players! Who will be the winner? Maybe you!</p>
		<button class="bg-green-300 rounded rounded-full p-3 object-center" @click="join">Start a new game</button>
	</div>
`
};
