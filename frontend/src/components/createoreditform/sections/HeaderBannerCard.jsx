import { useState } from "react";
import PropTypes from "prop-types";
import { MdOutlineImage, MdOutlineClose } from "react-icons/md";
import ImagePickerModal from "../../modals/ImagePickerModal";

const HeaderBannerCard = ({ headerImage, onHeaderImageChange }) => {
	const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);

	if (!headerImage) return null;

	return (
		<>
			<div className="w-[780px] h-[160px] md:h-[180px] rounded-lg overflow-hidden bg-white border border-[#DADCE0] shadow-xs relative group">
				<img
					src={headerImage}
					alt="Form header banner"
					className="w-full h-full object-cover"
				/>
				<div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition duration-150">
					<button
						type="button"
						onClick={() => setIsBannerModalOpen(true)}
						className="bg-white/90 hover:bg-white text-[#202124] text-xs font-medium px-3 py-1.5 rounded-md shadow-md backdrop-blur-xs transition cursor-pointer flex items-center gap-1.5"
					>
						<MdOutlineImage className="text-base text-[#673ab7]" />
						<span>Change banner</span>
					</button>

					<button
						type="button"
						onClick={() => onHeaderImageChange?.("")}
						className="bg-white/90 hover:bg-white text-red-600 p-1.5 rounded-md shadow-md backdrop-blur-xs transition cursor-pointer"
						title="Remove banner"
					>
						<MdOutlineClose className="text-base" />
					</button>
				</div>
			</div>

			<ImagePickerModal
				isOpen={isBannerModalOpen}
				onClose={() => setIsBannerModalOpen(false)}
				currentImage={headerImage}
				title="Add Header Banner"
				removeLabel="Remove banner"
				onSave={(url) => onHeaderImageChange?.(url)}
			/>
		</>
	);
};

HeaderBannerCard.propTypes = {
	headerImage: PropTypes.string,
	onHeaderImageChange: PropTypes.func,
};

export default HeaderBannerCard;
