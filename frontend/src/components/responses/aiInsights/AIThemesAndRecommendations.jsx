import PropTypes from "prop-types";
import { MdOutlineTrendingUp, MdOutlineLightbulb } from "react-icons/md";

const AIThemesAndRecommendations = ({ keyThemes = [], recommendations = [] }) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
			{/* Key Themes */}
			<div className="bg-[#F8F9FA] rounded-xl p-3.5 border border-gray-100">
				<div className="flex items-center gap-1.5 text-xs font-bold text-[#1F1F1F] mb-2">
					<MdOutlineTrendingUp className="text-[#673AB7] text-base" />
					<span>Key Themes & Patterns</span>
				</div>
				<ul className="space-y-1.5">
					{keyThemes.map((theme, idx) => (
						<li
							key={idx}
							className="text-xs text-[#3C4043] flex items-start gap-2 leading-snug"
						>
							<span className="w-1.5 h-1.5 rounded-full bg-[#673AB7] mt-1.5 shrink-0" />
							<span>{theme}</span>
						</li>
					))}
				</ul>
			</div>

			{/* Actionable Recommendations */}
			<div className="bg-[#F8F9FA] rounded-xl p-3.5 border border-gray-100">
				<div className="flex items-center gap-1.5 text-xs font-bold text-[#1F1F1F] mb-2">
					<MdOutlineLightbulb className="text-amber-500 text-base" />
					<span>Actionable Next Steps</span>
				</div>
				<ul className="space-y-1.5">
					{recommendations.map((rec, idx) => (
						<li
							key={idx}
							className="text-xs text-[#3C4043] flex items-start gap-2 leading-snug"
						>
							<span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
							<span>{rec}</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

AIThemesAndRecommendations.propTypes = {
	keyThemes: PropTypes.arrayOf(PropTypes.string),
	recommendations: PropTypes.arrayOf(PropTypes.string),
};

export default AIThemesAndRecommendations;
