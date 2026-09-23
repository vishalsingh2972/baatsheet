import PropTypes from "prop-types";
import { MdUploadFile, MdOutlineAutoAwesome } from "react-icons/md";

const ImagePickerTabs = ({ tab, onTabChange }) => {
	return (
		<div className="px-6 pt-3">
			<div className="w-full grid grid-cols-2 p-1 bg-[#F1F3F4] rounded-xl border border-gray-200">
				<button
					type="button"
					onClick={() => onTabChange("upload")}
					className={`w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
						tab === "upload"
							? "bg-white text-[#673AB7] shadow-xs"
							: "text-[#5F6368] hover:text-[#202124]"
					}`}
				>
					<MdUploadFile className="text-base" />
					<span>Upload & Link</span>
				</button>

				<button
					type="button"
					onClick={() => onTabChange("ai")}
					className={`w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
						tab === "ai"
							? "bg-white text-[#673AB7] shadow-xs"
							: "text-[#5F6368] hover:text-[#202124]"
					}`}
				>
					<MdOutlineAutoAwesome className="text-base" />
					<span>Generate with AI</span>
				</button>
			</div>
		</div>
	);
};

ImagePickerTabs.propTypes = {
	tab: PropTypes.string.isRequired,
	onTabChange: PropTypes.func.isRequired,
};

export default ImagePickerTabs;
