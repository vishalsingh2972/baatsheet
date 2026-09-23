import PropTypes from "prop-types";
import FormattedText from "../../common/FormattedText";

const PreviewImageCard = ({
	title,
	image,
	alignment = "center",
	hoverText = "",
}) => {
	const alignmentClass =
		alignment === "left"
			? "justify-start"
			: alignment === "right"
			? "justify-end"
			: "justify-center";

	return (
		<div className="w-full bg-white rounded-lg border border-[#dadce0] p-6 shadow-sm mb-4">
			{title && (
				<h3 className="text-xl font-normal text-[#202124] mb-4 break-words">
					<FormattedText text={title} />
				</h3>
			)}

			{image ? (
				<div className={`w-full flex ${alignmentClass}`}>
					<img
						src={image}
						alt={title || hoverText || "Form visual"}
						title={hoverText || title || undefined}
						className="max-h-[420px] max-w-full rounded-lg object-contain border border-[#dadce0] shadow-2xs"
					/>
				</div>
			) : (
				<div className="w-full py-8 text-center text-xs text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
					No image provided
				</div>
			)}
		</div>
	);
};

PreviewImageCard.propTypes = {
	title: PropTypes.string,
	image: PropTypes.string,
	alignment: PropTypes.oneOf(["left", "center", "right"]),
	hoverText: PropTypes.string,
};

export default PreviewImageCard;
