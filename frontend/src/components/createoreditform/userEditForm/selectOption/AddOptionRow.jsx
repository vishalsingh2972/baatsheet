import PropTypes from "prop-types";
import { MdOutlineAutoAwesome } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const AddOptionRow = ({
	icon,
	hasOther,
	onAddOption,
	onAddOther,
	onSuggestWithAI,
	isGeneratingOptions,
}) => {
	return (
		<div className="flex items-center py-1 select-none flex-wrap gap-y-1">
			{icon}
			<div className="flex items-center gap-1.5 ml-2 text-sm flex-wrap">
				<span
					onClick={onAddOption}
					className="text-[#70757a] hover:text-gray-900 cursor-pointer"
				>
					Add option
				</span>

				{!hasOther && (
					<>
						<span className="text-[#70757a]">or</span>
						<button
							type="button"
							onClick={onAddOther}
							className="text-[#1a73e8] hover:bg-blue-50 font-medium px-1.5 py-0.5 rounded cursor-pointer transition duration-150"
						>
							add &quot;Other&quot;
						</button>
					</>
				)}

				{onSuggestWithAI && (
					<>
						<span className="text-[#dadce0] mx-0.5">•</span>
						<button
							type="button"
							onClick={onSuggestWithAI}
							disabled={isGeneratingOptions}
							className="flex items-center gap-1 text-[#673ab7] hover:bg-purple-50 hover:text-[#5a2ea6] font-medium px-2 py-0.5 rounded cursor-pointer transition duration-150 text-xs disabled:opacity-50"
						>
							{isGeneratingOptions ? (
								<AiOutlineLoading3Quarters className="animate-spin text-xs text-[#673ab7]" />
							) : (
								<MdOutlineAutoAwesome className="text-xs text-[#8E24AA] animate-pulse" />
							)}
							<span>
								{isGeneratingOptions
									? "Generating..."
									: "Suggest options with AI"}
							</span>
						</button>
					</>
				)}
			</div>
		</div>
	);
};

AddOptionRow.propTypes = {
	icon: PropTypes.node.isRequired,
	hasOther: PropTypes.bool.isRequired,
	onAddOption: PropTypes.func.isRequired,
	onAddOther: PropTypes.func.isRequired,
	onSuggestWithAI: PropTypes.func,
	isGeneratingOptions: PropTypes.bool,
};

export default AddOptionRow;
