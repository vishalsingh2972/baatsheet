import PropTypes from "prop-types";
import { MdOutlineAutoAwesome } from "react-icons/md";
import { QUICK_INSPIRATIONS } from "./aiTemplatesData";
import VoiceInputButton from "../../common/VoiceInputButton";

const AIPromptView = ({
	prompt,
	setPrompt,
	error,
	setError,
	onGenerate,
	onChipClick,
}) => {
	return (
		<div className="flex-1 px-7 py-5 overflow-y-auto flex flex-col justify-between">
			<div>
				<label className="block text-sm font-semibold text-[#1F1F1F] mb-2">
					What kind of form do you want to create?
				</label>

				<div className="relative">
					<textarea
						rows={5}
						value={prompt}
						onChange={(e) => {
							setPrompt(e.target.value);
							if (error) setError("");
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								onGenerate();
							}
						}}
						placeholder="Describe the form you want to create (e.g. Customer feedback survey with rating scales and contact info)..."
						className="w-full min-h-[125px] text-[15px] text-[#1F1F1F] placeholder:text-[#747775] p-4 pr-12 rounded-xl border border-gray-200 focus:border-[#673AB7] focus:ring-2 focus:ring-[#673AB7]/20 outline-none resize-none transition leading-relaxed bg-[#F8F9FA] focus:bg-white"
						autoFocus
					/>
					<div className="absolute right-3 bottom-3 z-10">
						<VoiceInputButton
							onTranscript={(text) => {
								setPrompt(text);
								if (error) setError("");
							}}
						/>
					</div>
				</div>

				{error && (
					<p className="text-xs text-red-600 mt-1.5 font-medium">
						{error}
					</p>
				)}

				{/* Suggestions Chips */}
				<div className="mt-4">
					<p className="text-xs font-semibold text-[#5F6368] mb-2 flex items-center gap-1">
						<MdOutlineAutoAwesome className="text-[#673AB7]" />
						<span>Try an instant template:</span>
					</p>
					<div className="flex flex-wrap gap-2 max-h-[130px] overflow-y-auto pr-1">
						{QUICK_INSPIRATIONS.map((item, idx) => (
							<button
								key={idx}
								type="button"
								onClick={() => onChipClick(item.prompt)}
								className="text-xs text-[#3C4043] bg-[#F1F3F4] hover:bg-[#E8DEF8] hover:text-[#673AB7] px-3.5 py-1.5 rounded-full transition cursor-pointer font-medium border border-transparent hover:border-[#673AB7]/30"
							>
								{item.label}
							</button>
						))}
					</div>
				</div>
			</div>

			<p className="text-[11px] text-[#747775] text-center mt-3">
				Press{" "}
				<kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] font-sans">
					Enter ↵
				</kbd>{" "}
				to generate with AI
			</p>
		</div>
	);
};

AIPromptView.propTypes = {
	prompt: PropTypes.string.isRequired,
	setPrompt: PropTypes.func.isRequired,
	error: PropTypes.string,
	setError: PropTypes.func.isRequired,
	onGenerate: PropTypes.func.isRequired,
	onChipClick: PropTypes.func.isRequired,
};

export default AIPromptView;
