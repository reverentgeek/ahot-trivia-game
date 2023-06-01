export default {
	props: {
		id: Number,
		playerName: String,
		countdown: Number
	},
	template: `
	<div class="mx-auto mt-8 text-center font-bold text-4xl">Get ready, {{ playerName }}!</div>
	<div class="flex flex-col items-center justify-center text-center h-full">
		<p class="text-8xl font-bold content-center">{{ countdown }}</p>
	</div>
`
};
