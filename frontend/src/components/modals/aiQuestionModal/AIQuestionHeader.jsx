import PropTypes from "prop-types";
import { MdOutlineAutoAwesome, MdClose, MdArrowBack } from "react-icons/md";

const AIQuestionHeader = ({
	isStagePreview,
	isLoading,
	mode,
	isHeader,
	prompt,
	onPromptChange,
	onClose,
	onBackToPrompt,
	onTryAgain,
}) => {
	if (!isStagePreview) {
		return (
			<div className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-gray-100 bg-white">
				<div className="flex items-center gap-2.5">
					<div className="w-8 h-8 rounded-xl bg-[#673AB7]/10 flex items-center justify-center text-[#673AB7]">
						<MdOutlineAutoAwesome className="text-lg" />
					</div>
					<div>
						<h3 className="text-base font-semibold text-[#1F1F1F] tracking-tight leading-none">
							{mode === "edit"
								? isHeader
									? "Edit Form Header with AI"
									: "Edit Active Question with AI"
								: "Add Questions with AI"}
						</h3>
						<p className="text-[11px] text-[#5F6368] mt-1">
							Powered by Google Gemini 2.5
						</p>
					</div>
				</div>

				<button
					type="button"
					disabled={isLoading}
					onClick={onClose}
					className="text-[#5F6368] hover:text-[#1F1F1F] hover:bg-slate-100 p-2 rounded-full transition cursor-pointer"
					title="Close"
				>
					<MdClose className="text-xl" />
				</button>
			</div>
		);
	}

	return (
		<div className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-gray-100 bg-white gap-3">
			<button
				type="button"
				disabled={isLoading}
				onClick={onBackToPrompt}
				className="text-[#444746] hover:text-[#1f1f1f] hover:bg-slate-100 p-2 rounded-full transition cursor-pointer flex-shrink-0 disabled:opacity-50"
				title="Back to edit prompt"
			>
				<MdArrowBack className="text-xl" />
			</button>

			{/* Editable Prompt Pill Container */}
			<div className="flex-1 flex items-center justify-between bg-[#F0F4F9] hover:bg-[#E9EEF6] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#673AB7]/25 focus-within:border-[#673AB7] rounded-full pl-4 pr-1.5 py-1 min-w-0 gap-2 border border-transparent transition">
				<input
					type="text"
					disabled={isLoading}
					value={prompt || ""}
					onChange={(e) => onPromptChange?.(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !isLoading) {
							e.preventDefault();
							onTryAgain();
						}
					}}
					placeholder="Modify prompt and try again..."
					className="flex-1 bg-transparent text-sm text-[#1F1F1F] placeholder:text-[#747775] outline-none min-w-0 font-normal py-0.5 disabled:opacity-75"
				/>

				<button
					type="button"
					disabled={isLoading}
					onClick={onTryAgain}
					className="flex-shrink-0 bg-[#C2E7FF] hover:bg-[#B3DEFF] active:scale-95 text-[#001D35] text-xs font-semibold px-3.5 py-1.5 rounded-full transition shadow-2xs cursor-pointer flex items-center gap-1 disabled:opacity-60"
					title="Try again with modified prompt (Enter ↵)"
				>
					<MdOutlineAutoAwesome className={`text-xs ${isLoading ? "animate-spin" : ""}`} />
					<span>{isLoading ? "Generating..." : "Try again"}</span>
				</button>
			</div>

			<button
				type="button"
				disabled={isLoading}
				onClick={onClose}
				className="text-[#444746] hover:text-[#1f1f1f] hover:bg-slate-100 p-2 rounded-full transition cursor-pointer flex-shrink-0 disabled:opacity-50"
				title="Close preview"
			>
				<MdClose className="text-xl" />
			</button>
		</div>
	);
};

AIQuestionHeader.propTypes = {
	isStagePreview: PropTypes.bool.isRequired,
	isLoading: PropTypes.bool.isRequired,
	mode: PropTypes.string.isRequired,
	isHeader: PropTypes.bool,
	prompt: PropTypes.string,
	onPromptChange: PropTypes.func,
	onClose: PropTypes.func.isRequired,
	onBackToPrompt: PropTypes.func.isRequired,
	onTryAgain: PropTypes.func.isRequired,
};

export default AIQuestionHeader;
