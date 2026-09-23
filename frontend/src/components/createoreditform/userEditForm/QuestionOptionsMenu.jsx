import PropTypes from "prop-types";
import { MdCheck } from "react-icons/md";

const QuestionOptionsMenu = ({
	isOpen,
	hasDescription,
	onToggleDescription,
}) => {
	if (!isOpen) return null;

	return (
		<div
			className="absolute right-0 bottom-full mb-2 w-52 bg-white rounded-xl shadow-xl border border-[#dadce0] py-2 z-30 animate-scaleUp"
			onClick={(e) => e.stopPropagation()}
		>
			<button
				type="button"
				onClick={(e) => {
					e.stopPropagation();
					onToggleDescription();
				}}
				className="w-full px-4 py-2.5 text-left text-sm text-[#202124] hover:bg-purple-50 flex items-center gap-3 transition duration-150 cursor-pointer"
			>
				<span className="w-5 flex items-center justify-center text-[#673ab7]">
					{hasDescription && <MdCheck className="text-xl" />}
				</span>
				<span className="font-normal text-sm">Description</span>
			</button>
		</div>
	);
};

QuestionOptionsMenu.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	hasDescription: PropTypes.bool.isRequired,
	onToggleDescription: PropTypes.func.isRequired,
};

export default QuestionOptionsMenu;
