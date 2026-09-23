import { useState } from "react";
import PropTypes from "prop-types";
import LeftSideActiveLine from "../LeftSideActiveLine";
import DraggingIcon from "../DraggingIcon";

const FormCard = ({
	activeElement,
	isDraggable = true,
	hasTopColorBar = false,
	topColor = "bg-[rgb(103,58,183)]",
	onPointerDownDrag,
	children,
	className = "",
	style = {},
}) => {
	const [isHover, setIsHover] = useState(false);

	return (
		<div
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
			style={style}
			className={`relative w-[780px] rounded-lg bg-white border ${
				activeElement
					? "border-[#DADCE0] shadow-md"
					: "border-[#e0e0e0] shadow-xs"
			} transition-shadow duration-200 ${className}`}
		>
			{/* Top colored accent bar if requested (e.g. for MainTitle) */}
			{hasTopColorBar && (
				<div
					className={`w-full h-[10px] ${topColor} rounded-t-lg absolute top-0 left-0`}
				/>
			)}

			{/* Drag and drop grip for dynamic cards */}
			{isDraggable && isHover && (
				<DraggingIcon onPointerDown={onPointerDownDrag} />
			)}

			<div className={`flex ${hasTopColorBar ? "pt-0.5" : ""}`}>
				{/* Left Side Active Line */}
				<LeftSideActiveLine activeElement={activeElement} />

				{/* Inner Content Area */}
				<div
					className={`w-full px-5 ${
						hasTopColorBar ? "pt-7 pb-5" : "pt-6 pb-5"
					}`}
				>
					{children}
				</div>
			</div>
		</div>
	);
};

FormCard.propTypes = {
	activeElement: PropTypes.bool,
	isDraggable: PropTypes.bool,
	hasTopColorBar: PropTypes.bool,
	topColor: PropTypes.string,
	onPointerDownDrag: PropTypes.func,
	children: PropTypes.node,
	className: PropTypes.string,
	style: PropTypes.object,
};

export default FormCard;
