import PropTypes from "prop-types";
import { MdDragIndicator, MdOutlineClose } from "react-icons/md";

const OptionItem = ({
	icon,
	optionText,
	optIdx,
	totalOptions,
	activeElement,
	isSelected,
	isHover,
	isDragging = false,
	dragStyle = {},
	onMouseEnter,
	onMouseLeave,
	onFocus,
	onBlur,
	onClick,
	onChange,
	onRemove,
	onPointerDownDrag,
}) => {
	return (
		<div
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			style={dragStyle}
			className={`flex items-center relative py-0.5 rounded-md group select-none ${
				isDragging
					? "bg-white shadow-md border border-gray-200 z-30"
					: ""
			}`}
		>
			{/* 6-Dots Drag Handle */}
			{activeElement && (
				<div
					onPointerDown={(e) => onPointerDownDrag?.(e, optIdx)}
					className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-700 transition absolute -left-5 flex items-center justify-center w-5 h-full touch-none"
					title="Drag to reorder"
				>
					<MdDragIndicator className="text-xl" />
				</div>
			)}

			{/* Radio or Checkbox Icon */}
			<div className="flex items-center justify-center shrink-0">
				{icon}
			</div>

			{/* Option Text Input */}
			<div
				className={`flex-grow mx-2 ${
					activeElement
						? isSelected
							? "border-[#4C2B87] border-b-[1.5px]"
							: isHover
								? "border-[#DADCE0] border-b"
								: "border-transparent border-b"
						: "border-transparent border-b"
				}`}
			>
				<input
					value={optionText || ""}
					onChange={(e) => onChange?.(e.target.value)}
					onFocus={onFocus}
					onBlur={onBlur}
					onClick={onClick}
					className={`flex-grow outline-none text-sm py-1.5 w-full bg-transparent ${
						!activeElement ? "cursor-pointer" : ""
					}`}
					placeholder={`Option ${optIdx + 1}`}
				/>
			</div>

			{/* Remove Option Button */}
			{activeElement && (
				<div
					className={`p-1.5 rounded-full hover:bg-slate-100 cursor-pointer text-[#5f6368] hover:text-[#202124] transition duration-150 ${
						totalOptions > 1 ? "block" : "invisible"
					}`}
					onClick={onRemove}
					title="Remove option"
				>
					<MdOutlineClose fontSize="1.3em" />
				</div>
			)}
		</div>
	);
};

OptionItem.propTypes = {
	icon: PropTypes.node.isRequired,
	optionText: PropTypes.string.isRequired,
	optIdx: PropTypes.number.isRequired,
	totalOptions: PropTypes.number.isRequired,
	activeElement: PropTypes.bool.isRequired,
	isSelected: PropTypes.bool.isRequired,
	isHover: PropTypes.bool.isRequired,
	isDragging: PropTypes.bool,
	dragStyle: PropTypes.object,
	onMouseEnter: PropTypes.func.isRequired,
	onMouseLeave: PropTypes.func.isRequired,
	onFocus: PropTypes.func.isRequired,
	onBlur: PropTypes.func.isRequired,
	onClick: PropTypes.func.isRequired,
	onChange: PropTypes.func,
	onRemove: PropTypes.func.isRequired,
	onPointerDownDrag: PropTypes.func,
};

export default OptionItem;
