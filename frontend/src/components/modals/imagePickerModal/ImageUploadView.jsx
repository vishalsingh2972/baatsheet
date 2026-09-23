import PropTypes from "prop-types";
import { MdLink, MdUploadFile, MdOutlineImage } from "react-icons/md";

const ImageUploadView = ({
	imageUrl,
	previewUrl,
	isProcessing,
	onUrlChange,
	onFileUpload,
	onImageError,
}) => {
	return (
		<div className="space-y-3.5">
			{/* 1. Image URL Input */}
			<div>
				<label className="block text-xs font-semibold text-[#5F6368] uppercase tracking-wider mb-1 flex items-center gap-1">
					<MdLink className="text-base" />
					<span>Image URL</span>
				</label>
				<input
					type="url"
					value={imageUrl.startsWith("data:") ? "" : imageUrl}
					onChange={(e) => onUrlChange(e.target.value)}
					placeholder="https://example.com/image.jpg"
					className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-[#673AB7] focus:ring-2 focus:ring-[#673AB7]/20 transition bg-[#F8F9FA] focus:bg-white"
				/>
			</div>

			<div className="flex items-center gap-3 text-xs text-gray-400">
				<div className="h-[1px] bg-gray-200 flex-grow" />
				<span>OR UPLOAD FILE</span>
				<div className="h-[1px] bg-gray-200 flex-grow" />
			</div>

			{/* 2. Upload Box */}
			<div>
				<label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-[#673AB7] rounded-xl p-4 cursor-pointer bg-[#F8F9FA] hover:bg-[#F3EDF7]/40 transition">
					<MdUploadFile className="text-3xl text-[#673AB7] mb-1" />
					<span className="text-xs font-semibold text-[#1F1F1F]">
						{isProcessing ? "Processing image..." : "Click to upload an image"}
					</span>
					<span className="text-[11px] text-gray-400 mt-0.5">
						PNG, JPG, WebP up to 5MB
					</span>
					<input
						type="file"
						accept="image/*"
						onChange={onFileUpload}
						disabled={isProcessing}
						className="hidden"
					/>
				</label>
			</div>

			{/* 3. Preview Section with Always Visible Box */}
			<div>
				<p className="text-xs font-semibold text-[#5F6368] uppercase tracking-wider mb-1.5">
					Preview
				</p>
				{previewUrl ? (
					<div className="h-40 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center p-2">
						<img
							src={previewUrl}
							alt="Upload Preview"
							onError={onImageError}
							className="max-h-36 w-auto object-contain"
						/>
					</div>
				) : (
					<div className="h-36 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/70 flex flex-col items-center justify-center text-gray-400 gap-1.5 select-none">
						<MdOutlineImage className="text-3xl text-gray-300" />
						<span className="text-xs font-medium text-gray-400">
							No image selected yet
						</span>
					</div>
				)}
			</div>
		</div>
	);
};

ImageUploadView.propTypes = {
	imageUrl: PropTypes.string,
	previewUrl: PropTypes.string,
	isProcessing: PropTypes.bool.isRequired,
	onUrlChange: PropTypes.func.isRequired,
	onFileUpload: PropTypes.func.isRequired,
	onImageError: PropTypes.func.isRequired,
};

export default ImageUploadView;
