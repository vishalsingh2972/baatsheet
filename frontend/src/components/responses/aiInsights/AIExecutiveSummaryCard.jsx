import PropTypes from "prop-types";

const AIExecutiveSummaryCard = ({ summaryText }) => {
	return (
		<div className="bg-[#FAF8FD] border-l-4 border-[#673AB7] rounded-r-xl p-3.5">
			<span className="text-[11px] font-bold text-[#673AB7] uppercase tracking-wider block mb-1">
				Executive Takeaway
			</span>
			<p className="text-xs text-[#202124] leading-relaxed font-normal">
				{summaryText}
			</p>
		</div>
	);
};

AIExecutiveSummaryCard.propTypes = {
	summaryText: PropTypes.string.isRequired,
};

export default AIExecutiveSummaryCard;
