import PropTypes from "prop-types";

const PreviewShortAnswer = ({ value, onChange }) => {
	return (
		<div className="w-1/2 min-w-[260px] max-w-sm">
			<input
				type="text"
				maxLength={500}
				value={value || ""}
				onChange={(e) => onChange(e.target.value)}
				placeholder="Your answer"
				className="w-full border-b border-[#dadce0] focus:border-b-2 focus:border-[#673ab7] outline-none text-sm text-[#202124] placeholder-[#70757a] pb-1.5 bg-transparent transition-colors duration-150"
			/>
		</div>
	);
};

PreviewShortAnswer.propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func.isRequired,
};

export default PreviewShortAnswer;
