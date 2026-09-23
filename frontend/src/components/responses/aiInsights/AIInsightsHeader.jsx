import PropTypes from "prop-types";
import {
	MdOutlineAutoAwesome,
	MdOutlineContentCopy,
	MdCheck,
	MdOutlineRefresh,
	MdKeyboardArrowUp,
	MdKeyboardArrowDown,
} from "react-icons/md";

const AIInsightsHeader = ({
	responseCount,
	totalResponses,
	copied,
	isExpanded,
	onCopy,
	onRefresh,
	onToggleExpand,
}) => {
	return (
		<div className="px-5 py-3.5 bg-gradient-to-r from-purple-50/70 via-[#F3EDF7]/30 to-white border-b border-purple-50 flex items-center justify-between gap-3">
			<div className="flex items-center gap-2.5">
				<div className="w-7 h-7 rounded-lg bg-[#673AB7]/10 flex items-center justify-center text-[#673AB7]">
					<MdOutlineAutoAwesome className="text-base" />
				</div>
				<div>
					<h3 className="text-sm font-bold text-[#1F1F1F] leading-none flex items-center gap-1.5">
						<span>AI Responses Intelligence</span>
						<span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-[#673AB7]">
							Analyzed
						</span>
					</h3>
					<p className="text-[11px] text-[#5F6368] mt-0.5">
						Synthesized from {responseCount || totalResponses}{" "}
						submission{totalResponses === 1 ? "" : "s"}
					</p>
				</div>
			</div>

			<div className="flex items-center gap-1.5">
				{/* Copy Button */}
				<button
					type="button"
					onClick={onCopy}
					className="p-1.5 text-xs font-medium text-[#5F6368] hover:text-[#1F1F1F] hover:bg-white rounded-lg transition flex items-center gap-1 cursor-pointer border border-transparent hover:border-gray-200"
					title="Copy summary to clipboard"
				>
					{copied ? (
						<>
							<MdCheck className="text-green-600 text-sm" />
							<span className="text-green-600">Copied</span>
						</>
					) : (
						<>
							<MdOutlineContentCopy className="text-sm" />
							<span>Copy</span>
						</>
					)}
				</button>

				{/* Refresh / Re-analyze Button */}
				<button
					type="button"
					onClick={onRefresh}
					className="p-1.5 text-xs font-medium text-[#5F6368] hover:text-[#673AB7] hover:bg-white rounded-lg transition flex items-center gap-1 cursor-pointer border border-transparent hover:border-gray-200"
					title="Re-analyze responses"
				>
					<MdOutlineRefresh className="text-sm" />
					<span>Refresh</span>
				</button>

				{/* Collapse Toggle */}
				<button
					type="button"
					onClick={onToggleExpand}
					className="p-1.5 rounded-lg text-[#5F6368] hover:bg-white transition cursor-pointer"
					title={isExpanded ? "Collapse" : "Expand"}
				>
					{isExpanded ? (
						<MdKeyboardArrowUp className="text-lg" />
					) : (
						<MdKeyboardArrowDown className="text-lg" />
					)}
				</button>
			</div>
		</div>
	);
};

AIInsightsHeader.propTypes = {
	responseCount: PropTypes.number,
	totalResponses: PropTypes.number.isRequired,
	copied: PropTypes.bool.isRequired,
	isExpanded: PropTypes.bool.isRequired,
	onCopy: PropTypes.func.isRequired,
	onRefresh: PropTypes.func.isRequired,
	onToggleExpand: PropTypes.func.isRequired,
};

export default AIInsightsHeader;
