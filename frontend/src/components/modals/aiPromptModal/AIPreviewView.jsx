import PropTypes from "prop-types";

const AIPreviewView = ({ previewData }) => {
	const items = Array.isArray(previewData?.items) ? previewData.items : [];

	return (
		<div className="flex-1 bg-[#F7F8FC] px-6 py-5 overflow-y-auto space-y-4">
			{/* Form Title & Description Card */}
			<div className="bg-white rounded-xl p-6 shadow-xs border-t-[6px] border-[#673AB7]">
				<h2 className="text-2xl font-bold text-[#1F1F1F] tracking-tight">
					{previewData?.title || "Untitled Form"}
				</h2>
				{previewData?.description && (
					<p className="text-sm text-[#444746] mt-2.5 whitespace-pre-wrap leading-relaxed">
						{previewData.description}
					</p>
				)}
			</div>

			{/* Generated Question Cards */}
			{items.map((item, index) => (
				<div
					key={index}
					className="bg-white rounded-xl p-5 shadow-xs border border-gray-100 transition"
				>
					<div className="flex items-baseline justify-between mb-3">
						<p className="text-[15px] font-medium text-[#1F1F1F]">
							{item.questionTitle || "Untitled Question"}
							{item.required && (
								<span className="text-red-500 ml-1" title="Required">
									*
								</span>
							)}
						</p>
					</div>

					{/* Choices / Input Field Types */}
					{(item.questionType === "multiplechoice" ||
						item.questionType === "dropdown") && (
						<div className="space-y-2.5 mt-2">
							{(item.options || ["Option 1"]).map((opt, optIdx) => (
								<div
									key={optIdx}
									className="flex items-center text-sm text-[#3c4043]"
								>
									<div className="w-4 h-4 rounded-full border-2 border-gray-400 mr-3 flex-shrink-0" />
									<span>{opt}</span>
								</div>
							))}
						</div>
					)}

					{item.questionType === "checkbox" && (
						<div className="space-y-2.5 mt-2">
							{(item.options || ["Option 1"]).map((opt, optIdx) => (
								<div
									key={optIdx}
									className="flex items-center text-sm text-[#3c4043]"
								>
									<div className="w-4 h-4 rounded border-2 border-gray-400 mr-3 flex-shrink-0" />
									<span>{opt}</span>
								</div>
							))}
						</div>
					)}

					{item.questionType === "shortanswer" && (
						<div className="mt-3">
							<div className="w-3/5 border-b border-dotted border-gray-400 pb-1 text-xs text-gray-400 font-light">
								Short-answer text
							</div>
						</div>
					)}

					{item.questionType === "paragraph" && (
						<div className="mt-3">
							<div className="w-4/5 border-b border-dotted border-gray-400 pb-1 text-xs text-gray-400 font-light">
								Long-answer text
							</div>
						</div>
					)}
				</div>
			))}
		</div>
	);
};

AIPreviewView.propTypes = {
	previewData: PropTypes.shape({
		title: PropTypes.string,
		description: PropTypes.string,
		items: PropTypes.arrayOf(PropTypes.object),
	}),
};

export default AIPreviewView;
