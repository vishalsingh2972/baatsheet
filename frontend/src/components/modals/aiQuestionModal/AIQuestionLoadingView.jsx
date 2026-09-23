import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
	MdOutlineAutoAwesome,
	MdOutlinePsychology,
	MdOutlineFormatListBulleted,
	MdOutlineDashboardCustomize,
	MdOutlineEditNote,
	MdOutlineAutoFixHigh,
} from "react-icons/md";

const ADD_STEPS = [
	{
		title: "Analyzing prompt & intent",
		detail: "Identifying topics, goals, and optimal format...",
		icon: <MdOutlinePsychology className="text-[#8E24AA] text-base animate-pulse" />,
	},
	{
		title: "Generating questions & choice options",
		detail: "Designing realistic questions and logical options...",
		icon: <MdOutlineFormatListBulleted className="text-[#673AB7] text-base animate-pulse" />,
	},
	{
		title: "Finalizing layout & response preview",
		detail: "Structuring question cards and validation rules...",
		icon: <MdOutlineDashboardCustomize className="text-[#1E88E5] text-base animate-pulse" />,
	},
];

const EDIT_STEPS = [
	{
		title: "Analyzing section & instruction",
		detail: "Reviewing context and requested refinements...",
		icon: <MdOutlineEditNote className="text-[#8E24AA] text-base animate-pulse" />,
	},
	{
		title: "Polishing wording & tone",
		detail: "Rewriting title, description, and choices...",
		icon: <MdOutlineAutoFixHigh className="text-[#673AB7] text-base animate-pulse" />,
	},
	{
		title: "Applying section updates",
		detail: "Formatting preview with updated structure...",
		icon: <MdOutlineDashboardCustomize className="text-[#1E88E5] text-base animate-pulse" />,
	},
];

const AIQuestionLoadingView = ({ mode, isHeader }) => {
	const [stepIndex, setStepIndex] = useState(0);
	const steps = mode === "edit" ? EDIT_STEPS : ADD_STEPS;

	useEffect(() => {
		const interval = setInterval(() => {
			setStepIndex((prev) => (prev + 1) % steps.length);
		}, 1800);
		return () => clearInterval(interval);
	}, [steps.length]);

	const currentStep = steps[stepIndex] || steps[0];

	return (
		<div className="flex-1 bg-white p-8 relative overflow-hidden flex flex-col items-center justify-center select-none">
			{/* Top Indeterminate Gradient Progress Line */}
			<div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#8E24AA] via-[#673AB7] via-[#1E88E5] to-[#8E24AA] animate-pulse" />

			{/* Centered Minimal Gemini Loader */}
			<div className="flex flex-col items-center justify-center text-center max-w-[360px]">
				{/* Glowing Gemini Aura Icon */}
				<div className="relative w-18 h-18 mb-5 flex items-center justify-center">
					<div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#673AB7] via-[#8E24AA] to-[#1E88E5] opacity-20 animate-ping blur-xs" />
					<div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-[#673AB7] via-[#8E24AA] to-[#1E88E5] opacity-30 animate-pulse blur-xs" />
					<div className="relative w-14 h-14 rounded-xl bg-gradient-to-tr from-[#673AB7] via-[#8E24AA] to-[#1E88E5] flex items-center justify-center shadow-md">
						<MdOutlineAutoAwesome className="text-white text-2xl animate-spin [animation-duration:5s]" />
					</div>
				</div>

				<h3 className="text-lg font-bold text-[#1F1F1F] tracking-tight">
					{mode === "edit"
						? isHeader
							? "Refining form header with Gemini"
							: "Refining question with Gemini"
						: "Crafting question(s) with Gemini"}
				</h3>

				{/* Live Cycling Stage Pill */}
				<div className="mt-3.5 inline-flex items-center gap-2 bg-[#F8F9FD] border border-purple-100 px-4 py-1.5 rounded-full shadow-2xs transition-all duration-300">
					{currentStep.icon}
					<span className="text-xs font-semibold text-[#673AB7]">
						{currentStep.title}
					</span>
				</div>

				<p className="text-xs text-[#5F6368] mt-2.5 font-normal leading-relaxed">
					{currentStep.detail}
				</p>
			</div>
		</div>
	);
};

AIQuestionLoadingView.propTypes = {
	mode: PropTypes.string.isRequired,
	isHeader: PropTypes.bool,
};

export default AIQuestionLoadingView;
