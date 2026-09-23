import PropTypes from "prop-types";
import { MdOutlineClose } from "react-icons/md";

const AIQuestionPreviewView = ({
	mode,
	isHeader,
	previewQuestions = [],
	previewHeader = null,
	onRemoveQuestion,
}) => {
	if (mode === "edit" && isHeader && previewHeader) {
		return (
			<div className="flex-1 bg-[#F7F8FC] p-6 overflow-y-auto space-y-4">
				<div className="bg-white rounded-xl p-6 shadow-xs border-t-[6px] border-[#673AB7]">
					<h2 className="text-xl font-bold text-[#1F1F1F] tracking-tight">
						{previewHeader.title || "Untitled Form"}
					</h2>
					{previewHeader.description && (
						<p className="text-sm text-[#444746] mt-2.5 whitespace-pre-wrap leading-relaxed">
							{previewHeader.description}
						</p>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="flex-1 bg-[#F7F8FC] p-6 overflow-y-auto space-y-4">
			{previewQuestions.length === 0 ? (
				<div className="text-center py-12 text-gray-500 text-sm">
					No questions to preview.
				</div>
			) : (
				previewQuestions.map((item, index) => (
					<div
						key={index}
						className="bg-white rounded-xl p-5 shadow-xs border border-gray-100 relative group transition"
					>
						{/* Remove individual question button (when multiple questions generated) */}
						{mode === "add" && previewQuestions.length > 1 && (
							<button
								type="button"
								onClick={() => onRemoveQuestion?.(index)}
								className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
								title="Remove this question"
							>
								<MdOutlineClose className="text-lg" />
							</button>
						)}

						<div className="flex items-baseline justify-between mb-3 pr-6">
							<p className="text-[15px] font-medium text-[#1F1F1F] leading-snug">
								{mode === "add" && previewQuestions.length > 1 && (
									<span className="text-gray-400 font-semibold mr-1.5">
										{index + 1}.
									</span>
								)}
								{item.questionTitle || "Untitled Question"}
								{item.required && (
									<span className="text-red-500 ml-1" title="Required">
										*
									</span>
								)}
							</p>
						</div>

						{/* Multiple Choice / Radio Options */}
						{(item.questionType === "multiplechoice" ||
							item.questionType === "dropdown") && (
							<div className="space-y-2.5 mt-3">
								{(item.options || ["Option 1"]).map((opt, optIdx) => (
									<div
										key={optIdx}
										className="flex items-center text-sm text-[#3C4043]"
									>
										<div className="w-4 h-4 rounded-full border-2 border-gray-400 mr-3 flex-shrink-0" />
										<span>{opt}</span>
									</div>
								))}
							</div>
						)}

						{/* Checkboxes */}
						{item.questionType === "checkbox" && (
							<div className="space-y-2.5 mt-3">
								{(item.options || ["Option 1"]).map((opt, optIdx) => (
									<div
										key={optIdx}
										className="flex items-center text-sm text-[#3C4043]"
									>
										<div className="w-4 h-4 rounded border-2 border-gray-400 mr-3 flex-shrink-0" />
										<span>{opt}</span>
									</div>
								))}
							</div>
						)}

						{/* Short Answer */}
						{item.questionType === "shortanswer" && (
							<div className="mt-3.5">
								<div className="w-3/5 border-b border-dotted border-gray-400 pb-1 text-xs text-gray-400 font-light">
									Short-answer text
								</div>
							</div>
						)}

						{/* Paragraph */}
						{item.questionType === "paragraph" && (
							<div className="mt-3.5">
								<div className="w-4/5 border-b border-dotted border-gray-400 pb-1 text-xs text-gray-400 font-light">
									Long-answer text
								</div>
							</div>
						)}
					</div>
				))
			)}
		</div>
	);
};

AIQuestionPreviewView.propTypes = {
	mode: PropTypes.string.isRequired,
	isHeader: PropTypes.bool,
	previewQuestions: PropTypes.arrayOf(PropTypes.object),
	previewHeader: PropTypes.shape({
		title: PropTypes.string,
		description: PropTypes.string,
	}),
	onRemoveQuestion: PropTypes.func,
};

export default AIQuestionPreviewView;
