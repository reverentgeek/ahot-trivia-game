export default {
	props: {
		id: Number,
		playerName: String,
		countdown: Number
	},
	template: `
	<h2 class="font-bold">Get Ready, {{ playerName }}! Game Starting in...</h2>
	<p class="my-4 text-5xl content-center">{{ countdown }}</p>
`
};
