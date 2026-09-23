import PropTypes from "prop-types";
import { BsCloudCheck, BsCloudUpload, BsCloudSlash } from "react-icons/bs";

const SaveStatusIndicator = ({ saveStatus = "idle" }) => {
	switch (saveStatus) {
		case "saving":
			return (
				<div
					className="flex items-center gap-1.5 text-xs text-gray-500 font-medium ml-2 animate-pulse"
					title="Saving changes to database..."
				>
					<BsCloudUpload className="text-base text-[#673ab7]" />
					<span className="hidden sm:inline">Saving...</span>
				</div>
			);
		case "saved":
			return (
				<div
					className="flex items-center gap-1.5 text-xs text-gray-500 font-normal ml-2"
					title="All changes saved in Database"
				>
					<BsCloudCheck className="text-base text-gray-500" />
					<span className="hidden md:inline">
						All changes saved in Database
					</span>
				</div>
			);
		case "draft":
			return (
				<div
					className="flex items-center gap-1.5 text-xs text-gray-400 font-normal ml-2"
					title="Saved locally on this device"
				>
					<BsCloudCheck className="text-base text-gray-400" />
					<span className="hidden md:inline">Saved to draft</span>
				</div>
			);
		case "error":
			return (
				<div
					className="flex items-center gap-1.5 text-xs text-red-500 font-medium ml-2"
					title="Failed to save"
				>
					<BsCloudSlash className="text-base text-red-500" />
					<span className="hidden sm:inline">Save error</span>
				</div>
			);
		default:
			return null;
	}
};

SaveStatusIndicator.propTypes = {
	saveStatus: PropTypes.oneOf(["idle", "saving", "saved", "draft", "error"]),
};

export default SaveStatusIndicator;
