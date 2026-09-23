import PropTypes from "prop-types";
import { MdOutlineAutoAwesome } from "react-icons/md";
import { STYLE_PRESETS } from "./imagePickerData";
import VoiceInputButton from "../../common/VoiceInputButton";

const ImageAIPromptView = ({
	aiPrompt,
	isHeader,
	selectedStyle,
	ideas,
	isGeneratingAI,
	onPromptChange,
	onStyleSelect,
	onIdeaClick,
	onGenerateAI,
}) => {
	return (
		<div className="space-y-3">
			<div>
				<label className="block text-xs font-semibold text-[#5F6368] uppercase tracking-wider mb-1.5 flex items-center gap-1">
					<MdOutlineAutoAwesome className="text-[#673AB7]" />
					<span>Describe the image you want</span>
				</label>
				<div className="relative">
					<textarea
						rows={3}
						value={aiPrompt}
						onChange={(e) => onPromptChange(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey && !isGeneratingAI) {
								e.preventDefault();
								onGenerateAI();
							}
						}}
						placeholder={
							isHeader
								? "e.g. Minimalist abstract purple gradient for science survey header..."
								: "e.g. A blue fountain pen resting on a clean notepad..."
						}
						className="w-full min-h-[96px] text-sm border border-gray-200 rounded-xl p-3 pr-12 outline-none focus:border-[#673AB7] focus:ring-2 focus:ring-[#673AB7]/20 transition bg-[#F8F9FA] focus:bg-white resize-none leading-relaxed"
						autoFocus
					/>
					<div className="absolute right-2.5 bottom-2.5 z-10">
						<VoiceInputButton
							onTranscript={(text) => onPromptChange(text)}
							disabled={isGeneratingAI}
						/>
					</div>
				</div>
			</div>

			{/* Style Presets */}
			<div>
				<span className="text-xs text-[#5F6368] font-medium block mb-1">
					Style Preset:
				</span>
				<div className="flex flex-wrap gap-1">
					{STYLE_PRESETS.map((s, idx) => (
						<button
							key={idx}
							type="button"
							onClick={() => onStyleSelect(s.value)}
							className={`text-xs px-2.5 py-1 rounded-full border transition cursor-pointer font-medium ${
								selectedStyle === s.value
									? "bg-[#673AB7] text-white border-[#673AB7]"
									: "bg-[#F1F3F4] text-[#3C4043] hover:bg-[#EDE7F6] hover:text-[#673AB7] border-transparent"
							}`}
						>
							{s.label}
						</button>
					))}
				</div>
			</div>

			{/* Idea Chips */}
			<div>
				<span className="text-xs text-[#5F6368] font-medium block mb-1">
					Ideas to try:
				</span>
				<div className="flex flex-wrap gap-1">
					{ideas.map((idea, idx) => (
						<button
							key={idx}
							type="button"
							onClick={() => onIdeaClick(idea)}
							className="text-xs px-2.5 py-1 rounded-full bg-[#F1F3F4] text-[#3C4043] hover:bg-[#EDE7F6] hover:text-[#673AB7] border border-transparent transition cursor-pointer font-normal text-left"
						>
							{idea}
						</button>
					))}
				</div>
			</div>

			{/* Generate Button */}
			<button
				type="button"
				onClick={() => onGenerateAI()}
				disabled={!aiPrompt.trim() || isGeneratingAI}
				className="w-full py-2.5 px-4 mt-1 bg-[#673AB7] hover:bg-[#5A2EA6] text-white text-sm font-medium rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
			>
				<MdOutlineAutoAwesome className="text-base" />
				<span>Generate Image</span>
			</button>
		</div>
	);
};

ImageAIPromptView.propTypes = {
	aiPrompt: PropTypes.string.isRequired,
	isHeader: PropTypes.bool,
	selectedStyle: PropTypes.string,
	ideas: PropTypes.arrayOf(PropTypes.string).isRequired,
	isGeneratingAI: PropTypes.bool.isRequired,
	onPromptChange: PropTypes.func.isRequired,
	onStyleSelect: PropTypes.func.isRequired,
	onIdeaClick: PropTypes.func.isRequired,
	onGenerateAI: PropTypes.func.isRequired,
};

export default ImageAIPromptView;
