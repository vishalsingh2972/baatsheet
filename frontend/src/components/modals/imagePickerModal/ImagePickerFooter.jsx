import PropTypes from "prop-types";

const ImagePickerFooter = ({
	currentImage,
	removeLabel,
	isProcessing,
	isGeneratingAI,
	previewUrl,
	isAiPreviewStage,
	tab,
	onRemove,
	onClose,
	onDone,
}) => {
	const isDoneDisabled =
		isProcessing ||
		isGeneratingAI ||
		!previewUrl?.trim() ||
		(tab === "ai" && !isAiPreviewStage);

	return (
		<div className="h-16 shrink-0 flex items-center justify-between px-6 bg-[#F8F9FA] border-t border-gray-200">
			{currentImage ? (
				<button
					type="button"
					onClick={onRemove}
					className="text-sm text-red-600 hover:text-red-700 font-medium px-2 py-1 hover:bg-red-50 rounded-lg transition cursor-pointer"
				>
					{removeLabel}
				</button>
			) : (
				<div />
			)}
			<div className="flex items-center gap-2.5">
				<button
					type="button"
					onClick={onClose}
					className="px-4 py-2 text-sm font-medium text-[#5F6368] hover:text-[#1F1F1F] hover:bg-gray-200/60 rounded-xl transition cursor-pointer"
				>
					Cancel
				</button>
				<button
					type="button"
					onClick={onDone}
					disabled={isDoneDisabled}
					className="px-5 py-2 text-sm font-medium text-white bg-[#0B57D0] hover:bg-[#0842A0] rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Done
				</button>
			</div>
		</div>
	);
};

ImagePickerFooter.propTypes = {
	currentImage: PropTypes.string,
	removeLabel: PropTypes.string,
	isProcessing: PropTypes.bool.isRequired,
	isGeneratingAI: PropTypes.bool.isRequired,
	previewUrl: PropTypes.string,
	isAiPreviewStage: PropTypes.bool.isRequired,
	tab: PropTypes.string.isRequired,
	onRemove: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
	onDone: PropTypes.func.isRequired,
};

export default ImagePickerFooter;
