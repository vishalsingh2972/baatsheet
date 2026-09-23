import PropTypes from "prop-types";
import {
	MdOutlineImage,
	MdClose,
	MdOutlineAutoAwesome,
	MdArrowBack,
} from "react-icons/md";

const ImagePickerHeader = ({
	isAiPreviewStage,
	isGeneratingAI,
	title,
	isHeader,
	aiPrompt,
	onPromptChange,
	onTryAgain,
	onBackToPrompt,
	onClose,
}) => {
	if (isAiPreviewStage) {
		return (
			<div className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-gray-100 bg-white gap-3">
				<button
					type="button"
					disabled={isGeneratingAI}
					onClick={onBackToPrompt}
					className="text-[#444746] hover:text-[#1F1F1F] hover:bg-slate-100 p-2 rounded-full transition cursor-pointer flex-shrink-0 disabled:opacity-50"
					title="Back to prompt settings"
				>
					<MdArrowBack className="text-xl" />
				</button>

				{/* Editable Prompt Pill */}
				<div className="flex-1 flex items-center justify-between bg-[#F0F4F9] hover:bg-[#E9EEF6] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#673AB7]/25 focus-within:border-[#673AB7] rounded-full pl-4 pr-1.5 py-1 min-w-0 gap-2 border border-transparent transition">
					<input
						type="text"
						disabled={isGeneratingAI}
						value={aiPrompt || ""}
						onChange={(e) => onPromptChange?.(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !isGeneratingAI) {
								e.preventDefault();
								onTryAgain();
							}
						}}
						placeholder="Modify prompt..."
						className="flex-1 bg-transparent text-xs text-[#1F1F1F] placeholder:text-[#747775] outline-none min-w-0 font-normal py-0.5"
					/>

					<button
						type="button"
						disabled={isGeneratingAI}
						onClick={onTryAgain}
						className="flex-shrink-0 bg-[#C2E7FF] hover:bg-[#B3DEFF] active:scale-95 text-[#001D35] text-xs font-semibold px-3 py-1.5 rounded-full transition shadow-2xs cursor-pointer flex items-center gap-1 disabled:opacity-60"
						title="Generate another (Enter ↵)"
					>
						<MdOutlineAutoAwesome
							className={`text-xs ${isGeneratingAI ? "animate-spin" : ""}`}
						/>
						<span>{isGeneratingAI ? "Generating..." : "Try again"}</span>
					</button>
				</div>

				<button
					type="button"
					onClick={onClose}
					className="p-1.5 rounded-full text-[#5F6368] hover:bg-gray-100 hover:text-[#1F1F1F] transition cursor-pointer"
					title="Close"
				>
					<MdClose className="text-xl" />
				</button>
			</div>
		);
	}

	return (
		<div className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-gray-100 bg-white">
			<div className="flex items-center gap-2.5">
				<div className="w-8 h-8 rounded-xl bg-[#673AB7]/10 flex items-center justify-center text-[#673AB7]">
					<MdOutlineImage className="text-xl" />
				</div>
				<div>
					<h3 className="text-base font-semibold text-[#1F1F1F] leading-none">
						{title}
					</h3>
					<p className="text-[11px] text-[#5F6368] mt-1">
						{isHeader
							? "Recommended aspect ratio: 16:9 banner"
							: "Attach image to question or section"}
					</p>
				</div>
			</div>
			<button
				type="button"
				onClick={onClose}
				className="p-1.5 rounded-full text-[#5F6368] hover:bg-gray-100 hover:text-[#1F1F1F] transition cursor-pointer"
				title="Close"
			>
				<MdClose className="text-xl" />
			</button>
		</div>
	);
};

ImagePickerHeader.propTypes = {
	isAiPreviewStage: PropTypes.bool.isRequired,
	isGeneratingAI: PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired,
	isHeader: PropTypes.bool,
	aiPrompt: PropTypes.string,
	onPromptChange: PropTypes.func,
	onTryAgain: PropTypes.func.isRequired,
	onBackToPrompt: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default ImagePickerHeader;
