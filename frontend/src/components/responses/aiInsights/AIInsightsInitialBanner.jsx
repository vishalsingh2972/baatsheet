import PropTypes from "prop-types";
import { MdOutlineAutoAwesome } from "react-icons/md";

const AIInsightsInitialBanner = ({ totalResponses, onGenerate }) => {
	return (
		<div className="w-full bg-gradient-to-r from-purple-50 via-[#F3EDF7]/60 to-blue-50 border border-purple-100/90 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
			<div className="flex items-center gap-3.5">
				<div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#673AB7] to-[#8E24AA] flex items-center justify-center text-white shadow-xs shrink-0">
					<MdOutlineAutoAwesome className="text-xl" />
				</div>
				<div>
					<h3 className="text-sm font-bold text-[#1F1F1F] flex items-center gap-1.5">
						<span>AI Responses Intelligence</span>
						<span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-[#673AB7]">
							Gemini
						</span>
					</h3>
					<p className="text-xs text-[#5F6368] mt-0.5">
						Summarize key patterns, sentiment, and takeaways across all{" "}
						{totalResponses} submission{totalResponses === 1 ? "" : "s"}.
					</p>
				</div>
			</div>

			<button
				type="button"
				onClick={onGenerate}
				className="shrink-0 flex items-center gap-2 px-4 py-2 bg-[#673AB7] hover:bg-[#5A2EA6] text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow transition cursor-pointer active:scale-95"
			>
				<MdOutlineAutoAwesome className="text-sm" />
				<span>Generate AI Insights</span>
			</button>
		</div>
	);
};

AIInsightsInitialBanner.propTypes = {
	totalResponses: PropTypes.number.isRequired,
	onGenerate: PropTypes.func.isRequired,
};

export default AIInsightsInitialBanner;
