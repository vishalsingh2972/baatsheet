import PropTypes from "prop-types";

const FormatButton = ({
	icon: Icon,
	title,
	onClick,
	isActive = false,
	className = "",
}) => {
	return (
		<button
			type="button"
			onMouseDown={(e) => e.preventDefault()}
			onClick={onClick}
			className={`p-1.5 rounded-md transition cursor-pointer ${
				isActive
					? "bg-[#e8eaed] text-[#202124] font-bold"
					: "text-[#5f6368] hover:bg-slate-100 hover:text-[#202124]"
			} ${className}`}
			title={title}
		>
			<Icon fontSize="1.5em" />
		</button>
	);
};

FormatButton.propTypes = {
	icon: PropTypes.elementType.isRequired,
	title: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	isActive: PropTypes.bool,
	className: PropTypes.string,
};

export default FormatButton;
