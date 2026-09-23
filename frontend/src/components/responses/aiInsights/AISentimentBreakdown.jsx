import PropTypes from "prop-types";

const AISentimentBreakdown = ({ sentiment }) => {
	const pos = sentiment?.positive ?? 70;
	const neu = sentiment?.neutral ?? 20;
	const neg = sentiment?.negative ?? 10;

	return (
		<div>
			<div className="flex items-center justify-between text-xs mb-1.5">
				<span className="font-semibold text-[#5F6368] uppercase tracking-wider text-[11px]">
					Sentiment Distribution
				</span>
				<div className="flex items-center gap-3 text-xs font-medium">
					<span className="text-emerald-700 flex items-center gap-1">
						<span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
						{pos}% Positive
					</span>
					<span className="text-amber-700 flex items-center gap-1">
						<span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
						{neu}% Neutral
					</span>
					<span className="text-rose-700 flex items-center gap-1">
						<span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
						{neg}% Negative
					</span>
				</div>
			</div>

			{/* Segmented Progress Bar */}
			<div className="w-full h-2 rounded-full overflow-hidden flex bg-gray-100">
				<div
					style={{ width: `${pos}%` }}
					className="h-full bg-emerald-500 transition-all duration-500"
					title={`Positive: ${pos}%`}
				/>
				<div
					style={{ width: `${neu}%` }}
					className="h-full bg-amber-400 transition-all duration-500"
					title={`Neutral: ${neu}%`}
				/>
				<div
					style={{ width: `${neg}%` }}
					className="h-full bg-rose-500 transition-all duration-500"
					title={`Negative: ${neg}%`}
				/>
			</div>
		</div>
	);
};

AISentimentBreakdown.propTypes = {
	sentiment: PropTypes.shape({
		positive: PropTypes.number,
		neutral: PropTypes.number,
		negative: PropTypes.number,
	}),
};

export default AISentimentBreakdown;
