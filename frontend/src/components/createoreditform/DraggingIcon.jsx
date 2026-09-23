import PropTypes from "prop-types";
import { LuGripHorizontal } from "react-icons/lu";

const DraggingIcon = ({ onPointerDown }) => {
	return (
		<div
			onPointerDown={onPointerDown}
			className="absolute top-1 w-full flex justify-center cursor-move touch-none z-10 select-none py-1"
			title="Drag to reorder card"
		>
			<LuGripHorizontal
				className="cursor-move"
				color="#c8cbd0"
				fontSize="1.1em"
			/>
		</div>
	);
};

DraggingIcon.propTypes = {
	onPointerDown: PropTypes.func,
};

export default DraggingIcon;
