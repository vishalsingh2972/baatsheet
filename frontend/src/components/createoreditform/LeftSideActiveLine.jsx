/* eslint-disable react/prop-types */
const LeftSideActiveLine = ({ activeElement }) => {
	return (
		<div
			className={`w-[6px] ${
				activeElement ? "bg-[#4285f4]" : "bg-transparent"
			} rounded-l-lg `}
		/>
	);
};

export default LeftSideActiveLine;
