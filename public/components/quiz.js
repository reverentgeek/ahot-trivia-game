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
	<div class="flex flex-row w-full">
		<div class="flex-1">{{ playerName }}</div>
		<div class="flex-1 text-center"><span>Time:</span> {{ countdown }}</div>
		<div class="flex-1 text-right"><span>Score:</span> {{ score }}</div>
	</div>
	<div class="items-start">
		<div class="text-2xl mt-6 text-slate-400">Question {{ currentQuestionId + 1 }}</div>
		<div class="text-3xl my-6">{{ question.question }}</div>
		<ul>
			<li v-for="(choice, index) of question.choices">
				<button class="bg-green-300 rounded-full mt-4 mb-2 px-16 py-3" @click="answer(index)">{{ ( choice.choice === "True" || choice.choice === "False" ) ? choice.choice : ( index + 1 ) }}</button>
				<span class="ml-4 text-xl" v-if="choice.choice !== 'True' && choice.choice !== 'False'">{{ choice.choice }}</span>
			</li>
			<li class="mt-12">
				<button class="rounded-full mt-4 mb-2 px-16 py-3 bg-red-400" @click="skip">Skip</button>
			</li>
		</ul>
	</div>
`
};
