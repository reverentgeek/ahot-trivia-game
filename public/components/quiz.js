export default {
	props: {
		id: Number,
		playerName: String,
		countdown: Number,
		question: Object,
		currentQuestionId: Number,
		score: Number
	},
	emits: [ "answer", "skip" ],
	methods: {
		answer( index ) {
			this.$emit( "answer", index );
		},
		skip() {
			this.$emit( "skip", this.question.id );
		}
	},
	template: `
	<div>{{ playerName }}</div>
	<div>{{ score }}</div>
	<div>{{ question.question }}</div>
	<div>{{ countdown }}</div>
	<ul>
		<li v-for="(choice, index) of question.choices">
			<button class="bg-slate-400 rounded-full mt-4 mb-2 px-16 py-3" @click="answer(index)">{{ ( choice.choice === "True" || choice.choice === "False" ) ? choice.choice : ( index + 1 ) }}</button>
			<span v-if="choice.choice !== 'True' && choice.choice !== 'False'">{{ choice.choice }}</span>
		</li>
		<li class="mt-12">
			<button class="rounded-full mt-4 mb-2 px-16 py-3 bg-red-400" @click="skip">Skip</button>
		</li>
		<li>
			<span class="bg-orange-100 p-4 italic">Psst: correct choice is {{ question.correct }}</span>
		</li>
	</ul>
`
};
