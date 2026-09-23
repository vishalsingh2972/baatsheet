import PropTypes from "prop-types";
import { MdOutlineAutoAwesome } from "react-icons/md";

const AIQuestionFooter = ({
	isStagePreview,
	isLoading,
	mode,
	isHeader,
	prompt,
	previewQuestionsCount = 0,
	onClose,
	onGenerate,
	onAccept,
}) => {
	if (isLoading) {
		return <div className="h-16 shrink-0 border-t border-transparent" />;
	}

	if (!isStagePreview) {
		return (
			<div className="h-16 shrink-0 flex items-center justify-end gap-2.5 px-6 bg-[#F8F9FA] border-t border-gray-200">
				<button
					type="button"
					onClick={onClose}
					className="px-4 py-2 text-sm font-medium text-[#5F6368] hover:text-[#1F1F1F] hover:bg-slate-200/60 rounded-lg transition cursor-pointer"
				>
					Cancel
				</button>

				<button
					type="button"
					onClick={onGenerate}
					disabled={!prompt?.trim()}
					className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-white bg-[#673AB7] hover:bg-[#5A2EA6] rounded-xl transition shadow-sm hover:shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<MdOutlineAutoAwesome className="text-base" />
					<span>
						{mode === "edit"
							? isHeader
								? "Preview Header Update"
								: "Preview Question Update"
							: "Preview Question(s)"}
					</span>
				</button>
			</div>
		);
	}

	return (
		<div className="h-16 shrink-0 flex items-center justify-between px-6 bg-white border-t border-gray-100">
			<span className="text-xs text-gray-500 font-medium">
				{mode === "add"
					? `✨ ${previewQuestionsCount} question${
							previewQuestionsCount === 1 ? "" : "s"
					  } ready to insert`
					: "✨ Updated preview ready"}
			</span>

			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={onClose}
					className="px-4 py-2 text-sm font-medium text-[#5F6368] hover:bg-slate-100 rounded-lg transition cursor-pointer"
				>
					Cancel
				</button>

				<button
					type="button"
					onClick={onAccept}
					disabled={mode === "add" && previewQuestionsCount === 0}
					className="px-6 py-2 text-sm font-medium text-white bg-[#0B57D0] hover:bg-[#0842A0] rounded-full shadow-sm hover:shadow transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<span>
						{mode === "edit"
							? isHeader
								? "Update Header"
								: "Update Question"
							: previewQuestionsCount > 1
							? `Insert ${previewQuestionsCount} Questions`
							: "Insert Question"}
					</span>
				</button>
			</div>
		</div>
	);
};

AIQuestionFooter.propTypes = {
	isStagePreview: PropTypes.bool.isRequired,
	isLoading: PropTypes.bool.isRequired,
	mode: PropTypes.string.isRequired,
	isHeader: PropTypes.bool,
	prompt: PropTypes.string,
	previewQuestionsCount: PropTypes.number,
	onClose: PropTypes.func.isRequired,
	onGenerate: PropTypes.func.isRequired,
	onAccept: PropTypes.func.isRequired,
};

export default AIQuestionFooter;
