export const TEMPLATES = [
	{
		id: "contact",
		name: "Contact Information",
		title: "Contact Information",
		description: "Please fill out your contact details below.",
		headerColor: "bg-[#0f9d58]",
		items: [
			{
				type: "question",
				questionTitle: "Name",
				questionType: "shortanswer",
				required: true,
			},
			{
				type: "question",
				questionTitle: "Email",
				questionType: "shortanswer",
				required: true,
			},
			{
				type: "question",
				questionTitle: "Address",
				questionType: "paragraph",
				required: false,
			},
			{
				type: "question",
				questionTitle: "Phone number",
				questionType: "shortanswer",
				required: false,
			},
			{
				type: "question",
				questionTitle: "Comments",
				questionType: "paragraph",
				required: false,
			},
		],
	},
	{
		id: "feedback",
		name: "Customer Feedback",
		title: "Customer Feedback Survey",
		description: "We value your thoughts! Please take a moment to share your feedback.",
		headerColor: "bg-[#673ab7]",
		items: [
			{
				type: "question",
				questionTitle: "How satisfied were you with our service?",
				questionType: "multiplechoice",
				options: [
					"Very satisfied",
					"Satisfied",
					"Neutral",
					"Unsatisfied",
				],
				required: true,
			},
			{
				type: "question",
				questionTitle: "What did you like most about your experience?",
				questionType: "checkbox",
				options: [
					"Ease of use",
					"Speed of service",
					"Customer support",
					"Quality & reliability",
				],
				required: false,
			},
			{
				type: "question",
				questionTitle: "What areas can we improve upon?",
				questionType: "paragraph",
				required: false,
			},
			{
				type: "question",
				questionTitle: "Would you recommend us to colleagues or friends?",
				questionType: "multiplechoice",
				options: ["Yes, definitely", "Maybe", "No"],
				required: true,
			},
		],
	},
];
