import { useState, useEffect } from "react";
import {
	MdOutlineAutoAwesome,
	MdOutlinePsychology,
	MdOutlineFormatListBulleted,
	MdOutlineDashboardCustomize,
} from "react-icons/md";

const LOADING_STEPS = [
	{
		title: "Analyzing requirements & context",
		detail: "Identifying topics, goals, and key questions...",
		icon: <MdOutlinePsychology className="text-[#8E24AA] text-base animate-pulse" />,
	},
	{
		title: "Generating questions & choice options",
		detail: "Formulating realistic questions and choice options...",
		icon: <MdOutlineFormatListBulleted className="text-[#673AB7] text-base animate-pulse" />,
	},
	{
		title: "Structuring form layout & validation",
		detail: "Assembling title card, input types, and required rules...",
		icon: <MdOutlineDashboardCustomize className="text-[#1E88E5] text-base animate-pulse" />,
	},
];

const AILoadingView = () => {
	const [stepIndex, setStepIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
		}, 1900);
		return () => clearInterval(interval);
	}, []);

	const currentStep = LOADING_STEPS[stepIndex];

	return (
		<div className="flex-1 bg-[#F8F9FD] p-6 relative overflow-hidden flex flex-col justify-center select-none">
			{/* Top Indeterminate Gradient Progress Line */}
			<div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#8E24AA] via-[#673AB7] via-[#1E88E5] to-[#8E24AA] animate-pulse" />

			{/* 1. Full-Height Form Skeleton Layer */}
			<div className="w-full max-w-[700px] mx-auto space-y-4 opacity-40 pointer-events-none">
				{/* Title Card Skeleton */}
				<div className="bg-white rounded-xl p-5 shadow-xs border-t-[6px] border-[#673AB7] space-y-3">
					<div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-md w-2/5 animate-pulse" />
					<div className="h-3.5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-md w-3/4 animate-pulse" />
					<div className="h-3.5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-md w-1/2 animate-pulse" />
				</div>

				{/* Question Card 1 (Multiple Choice) */}
				<div className="bg-white rounded-xl p-5 shadow-xs border border-gray-100 space-y-3.5">
					<div className="flex items-center justify-between mb-1">
						<div className="h-4.5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-md w-1/2 animate-pulse" />
						<div className="h-3.5 bg-gray-100 rounded-md w-16 animate-pulse" />
					</div>

					{/* 3 Option Rows */}
					<div className="space-y-2.5 pt-1">
						<div className="flex items-center gap-3">
							<div className="w-4 h-4 rounded-full border-2 border-gray-300 animate-pulse" />
							<div className="h-3.5 bg-gray-100 rounded-md w-1/3 animate-pulse" />
						</div>
						<div className="flex items-center gap-3">
							<div className="w-4 h-4 rounded-full border-2 border-gray-300 animate-pulse" />
							<div className="h-3.5 bg-gray-100 rounded-md w-2/5 animate-pulse" />
						</div>
						<div className="flex items-center gap-3">
							<div className="w-4 h-4 rounded-full border-2 border-gray-300 animate-pulse" />
							<div className="h-3.5 bg-gray-100 rounded-md w-1/4 animate-pulse" />
						</div>
					</div>
				</div>

				{/* Question Card 2 (Checkboxes) */}
				<div className="bg-white rounded-xl p-5 shadow-xs border border-gray-100 space-y-3">
					<div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-md w-2/5 animate-pulse" />
					<div className="flex items-center gap-3 pt-1">
						<div className="w-4 h-4 rounded border-2 border-gray-300 animate-pulse" />
						<div className="h-3.5 bg-gray-100 rounded-md w-1/3 animate-pulse" />
					</div>
					<div className="flex items-center gap-3">
						<div className="w-4 h-4 rounded border-2 border-gray-300 animate-pulse" />
						<div className="h-3.5 bg-gray-100 rounded-md w-1/2 animate-pulse" />
					</div>
				</div>
			</div>

			{/* 2. Floating Frosted Gemini Status Card Overlay */}
			<div className="absolute inset-0 flex items-center justify-center p-4">
				<div className="bg-white/95 backdrop-blur-md border border-purple-100/80 rounded-2xl shadow-xl px-9 py-6 max-w-[420px] w-full text-center flex flex-col items-center animate-scale-up">
					{/* Glowing Gemini Aura Icon */}
					<div className="relative w-16 h-16 mb-3.5 flex items-center justify-center">
						<div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#8E24AA] via-[#673AB7] to-[#1E88E5] opacity-25 animate-ping blur-sm" />
						<div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-[#8E24AA] via-[#673AB7] to-[#1E88E5] opacity-35 animate-pulse blur-xs" />
						<div className="relative w-13 h-13 rounded-xl bg-gradient-to-tr from-[#673AB7] via-[#8E24AA] to-[#1E88E5] flex items-center justify-center shadow-md">
							<MdOutlineAutoAwesome className="text-white text-2xl animate-spin [animation-duration:5s]" />
						</div>
					</div>

					<h3 className="text-base font-bold text-[#1F1F1F] tracking-tight">
						Crafting your form with Gemini
					</h3>

					{/* Live Cycling Stage Pill */}
					<div className="mt-2.5 inline-flex items-center gap-2 bg-[#F3EDF7] border border-[#673AB7]/15 px-3.5 py-1.5 rounded-full transition-all duration-300">
						{currentStep.icon}
						<span className="text-xs font-semibold text-[#673AB7]">
							{currentStep.title}
						</span>
					</div>

					<p className="text-xs text-[#5F6368] mt-2 font-normal leading-relaxed">
						{currentStep.detail}
					</p>
				</div>
			</div>
		</div>
	);
};

export default AILoadingView;
