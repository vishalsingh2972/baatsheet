import PropTypes from "prop-types";
import { MdOutlineAutoAwesome } from "react-icons/md";

const AIGeneratorCard = ({ onOpenModal }) => {
	return (
		<div
			onClick={onOpenModal}
			className="w-[171px] cursor-pointer group flex-shrink-0"
		>
			<div className="w-[171px] h-[128px] rounded border-2 border-dashed border-[#673ab7]/40 group-hover:border-[#673ab7] bg-gradient-to-br from-[#F6EEFF] via-[#EDE7F6] to-[#E8DEF8] transition shadow-2xs group-hover:shadow-md overflow-hidden flex flex-col items-center justify-center relative">
				<div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#8E24AA] via-[#673AB7] to-[#1E88E5] flex items-center justify-center shadow-xs group-hover:scale-110 transition duration-200 mb-1.5">
					<MdOutlineAutoAwesome className="text-white text-lg animate-pulse" />
				</div>
				<span className="text-xs font-semibold text-[#673ab7]">
					Help me create
				</span>
				<span className="text-[10px] text-[#5F6368] mt-0.5">
					Powered by Gemini
				</span>
			</div>
			<p className="text-sm font-medium text-[#673ab7] mt-2 group-hover:text-[#5a2ea6] transition flex items-center justify-center gap-1 truncate w-full">
				<MdOutlineAutoAwesome className="text-xs text-[#8E24AA]" />
				<span>Generate with AI</span>
			</p>
		</div>
	);
};

AIGeneratorCard.propTypes = {
	onOpenModal: PropTypes.func.isRequired,
};

export default AIGeneratorCard;
