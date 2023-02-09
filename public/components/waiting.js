export default {
	props: {
		id: Number,
		playerName: String
	},
	template: `<h2>Waiting</h2>
	<p>Thanks for joining, {{ id }} {{ playerName }}!</p>
	<p>Waiting for other players to join...</p>
	`
};
