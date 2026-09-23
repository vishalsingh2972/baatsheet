import PropTypes from "prop-types";
import { MdDragIndicator, MdOutlineClose } from "react-icons/md";

const OtherOptionItem = ({
	icon,
	activeElement,
	isHover,
	onMouseEnter,
	onMouseLeave,
	onRemove,
}) => {
	return (
		<div
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			className="flex items-center relative py-1"
		>
			{activeElement && isHover && (
				<MdDragIndicator
					fontSize="1.2em"
					color="#c8cbd0"
					className="cursor-move absolute -left-5"
				/>
			)}

			{icon}

			<div className="flex items-center flex-grow mx-2 gap-2 min-w-0">
				<span className="text-sm text-[#202124] select-none whitespace-nowrap">
					Other:
				</span>
				<div className="flex-grow border-b border-dotted border-[#70757a] h-3.5" />
			</div>

			{activeElement && (
				<div
					className="p-1.5 rounded-full hover:bg-slate-100 cursor-pointer text-[#5f6368] hover:text-[#202124] transition duration-150 flex-shrink-0"
					onClick={onRemove}
					title="Remove Other"
				>
					<MdOutlineClose fontSize="1.3em" />
				</div>
			)}
		</div>
	);
};

OtherOptionItem.propTypes = {
	icon: PropTypes.node.isRequired,
	activeElement: PropTypes.bool.isRequired,
	isHover: PropTypes.bool.isRequired,
	onMouseEnter: PropTypes.func.isRequired,
	onMouseLeave: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
};

export default OtherOptionItem;
