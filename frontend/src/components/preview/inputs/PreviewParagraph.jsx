import { useRef } from "react";
import PropTypes from "prop-types";

const PreviewParagraph = ({ value, onChange }) => {
	const textareaRef = useRef(null);

	const handleInput = (e) => {
		onChange(e.target.value);
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	};

	return (
		<div className="w-full">
			<textarea
				ref={textareaRef}
				rows={1}
				maxLength={2000}
				value={value || ""}
				onChange={handleInput}
				placeholder="Your answer"
				className="w-full border-b border-[#dadce0] focus:border-b-2 focus:border-[#673ab7] outline-none text-sm text-[#202124] placeholder-[#70757a] pb-1.5 bg-transparent resize-none overflow-hidden transition-colors duration-150"
			/>
		</div>
	);
};

PreviewParagraph.propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func.isRequired,
};

export default PreviewParagraph;
