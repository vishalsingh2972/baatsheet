import PropTypes from "prop-types";
import {
	MdFormatAlignLeft,
	MdFormatAlignCenter,
	MdFormatAlignRight,
	MdOutlineImage,
	MdClose,
} from "react-icons/md";

const QuestionImageContainer = ({
	image,
	alignment = "center",
	onAlignmentChange,
	onChangeImage,
	onRemoveImage,
	activeElement = false,
}) => {
	if (!image) return null;

	const alignmentClass =
		alignment === "left"
			? "justify-start"
			: alignment === "right"
				? "justify-end"
				: "justify-center";

	return (
		<div className={`w-full my-3 flex ${alignmentClass}`}>
			<div className="relative group max-w-full inline-block">
				{/* Image */}
				<img
					src={image}
					alt="Question attachment"
					className="max-h-[380px] max-w-full rounded-lg object-contain border border-[#DADCE0] shadow-xs"
				/>

				{/* Floating Toolbar on Hover / Active */}
				{activeElement && (
					<div className="absolute top-2 right-2 flex items-center gap-1 bg-white/95 backdrop-blur-xs p-1 rounded-lg border border-[#DADCE0] shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
						{/* Alignment options */}
						<button
							type="button"
							onClick={() => onAlignmentChange?.("left")}
							className={`p-1.5 rounded hover:bg-slate-100 transition cursor-pointer ${
								alignment === "left"
									? "text-[#673ab7] bg-purple-50"
									: "text-[#5f6368]"
							}`}
							title="Align left"
						>
							<MdFormatAlignLeft className="text-base" />
						</button>

						<button
							type="button"
							onClick={() => onAlignmentChange?.("center")}
							className={`p-1.5 rounded hover:bg-slate-100 transition cursor-pointer ${
								alignment === "center"
									? "text-[#673ab7] bg-purple-50"
									: "text-[#5f6368]"
							}`}
							title="Align center"
						>
							<MdFormatAlignCenter className="text-base" />
						</button>

						<button
							type="button"
							onClick={() => onAlignmentChange?.("right")}
							className={`p-1.5 rounded hover:bg-slate-100 transition cursor-pointer ${
								alignment === "right"
									? "text-[#673ab7] bg-purple-50"
									: "text-[#5f6368]"
							}`}
							title="Align right"
						>
							<MdFormatAlignRight className="text-base" />
						</button>

						<div className="h-4 w-px bg-gray-200 mx-0.5" />

						{/* Change Image */}
						<button
							type="button"
							onClick={onChangeImage}
							className="p-1.5 rounded hover:bg-slate-100 text-[#5f6368] hover:text-[#202124] transition cursor-pointer"
							title="Change image"
						>
							<MdOutlineImage className="text-base" />
						</button>

						{/* Remove Image */}
						<button
							type="button"
							onClick={onRemoveImage}
							className="p-1.5 rounded hover:bg-red-50 text-red-600 transition cursor-pointer"
							title="Remove image"
						>
							<MdClose className="text-base" />
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

QuestionImageContainer.propTypes = {
	image: PropTypes.string,
	alignment: PropTypes.oneOf(["left", "center", "right"]),
	onAlignmentChange: PropTypes.func,
	onChangeImage: PropTypes.func,
	onRemoveImage: PropTypes.func,
	activeElement: PropTypes.bool,
};

export default QuestionImageContainer;
