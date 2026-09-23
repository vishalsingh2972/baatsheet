/**
 * Validates form responses and email collection settings.
 * Returns validation status, error states, and the DOM id of the first invalid target.
 */
export const validateFormResponses = ({
	settings = {},
	recordEmailChecked = true,
	respondentEmail = "",
	items = [],
	answers = {},
}) => {
	let emailError = false;

	// 1. Email validation based on collection mode
	if (settings.collectEmail === "verified") {
		emailError = !recordEmailChecked;
	} else if (settings.collectEmail === "responder_input") {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		emailError = !respondentEmail || !emailRegex.test(respondentEmail);
	}

	// 2. Required questions validation
	const questionErrors = {};
	let hasQuestionError = false;

	items.forEach((item, index) => {
		if (item.type === "question" && item.required) {
			const val = answers[index];
			const isEmpty =
				val === undefined ||
				val === "" ||
				(Array.isArray(val) && val.length === 0);

			if (isEmpty) {
				questionErrors[index] = true;
				hasQuestionError = true;
			}
		}
	});

	const isValid = !emailError && !hasQuestionError;

	// 3. Find first invalid DOM target ID for smooth auto-scrolling
	let firstInvalidTargetId = null;
	if (emailError) {
		firstInvalidTargetId = "field-email";
	} else if (hasQuestionError) {
		const invalidIndices = Object.keys(questionErrors)
			.map(Number)
			.filter((idx) => questionErrors[idx]);

		if (invalidIndices.length > 0) {
			const minIndex = Math.min(...invalidIndices);
			firstInvalidTargetId = `field-question-${minIndex}`;
		}
	}

	return {
		isValid,
		emailError,
		questionErrors,
		firstInvalidTargetId,
	};
};

/**
 * Smoothly scrolls to the first invalid field and focuses the input.
 */
export const scrollToFirstError = (targetId) => {
	if (!targetId || typeof document === "undefined") return;

	setTimeout(() => {
		const targetEl = document.getElementById(targetId);
		if (targetEl) {
			targetEl.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
			const inputEl = targetEl.querySelector(
				"input:not([type='hidden']), textarea, select, [tabindex='0']"
			);
			inputEl?.focus();
		}
	}, 50);
};

/**
 * Formats user answers into backend schema: [{ itemIndex, value }]
 */
export const formatResponsePayload = (answers = {}) => {
	return Object.keys(answers)
		.filter((idx) => {
			const val = answers[idx];
			return (
				val !== undefined &&
				val !== "" &&
				(!Array.isArray(val) || val.length > 0)
			);
		})
		.map((idx) => ({
			itemIndex: Number(idx),
			value: answers[idx],
		}));
};

/**
 * Resolves the respondent email to submit based on form settings.
 */
export const getRespondentEmail = (settings = {}, user = null, respondentEmail = "") => {
	if (settings.collectEmail === "verified") {
		return user?.email;
	}
	if (settings.collectEmail === "responder_input") {
		return respondentEmail;
	}
	return undefined;
};
