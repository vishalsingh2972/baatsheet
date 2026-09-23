import PropTypes from "prop-types";

const ImageAIPreviewView = ({ previewUrl, isHeader, onImageError }) => {
	return (
		<div className="my-auto flex flex-col items-center justify-center w-full animate-scale-up">
			<div
				className={`w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-900/5 shadow-sm flex items-center justify-center ${
					isHeader ? "h-[290px]" : "h-[310px]"
				}`}
			>
				<img
					src={previewUrl}
					alt="AI Generated Preview"
					onError={onImageError}
					className="w-full h-full object-cover"
				/>
			</div>
		</div>
	);
};

ImageAIPreviewView.propTypes = {
	previewUrl: PropTypes.string.isRequired,
	isHeader: PropTypes.bool,
	onImageError: PropTypes.func.isRequired,
};

export default ImageAIPreviewView;
