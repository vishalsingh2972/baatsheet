import PropTypes from "prop-types";
import { MdOutlineAutoAwesome } from "react-icons/md";

const AIInsightsLoadingView = ({ totalResponses }) => {
	return (
		<div className="w-full bg-white border border-purple-100 rounded-2xl p-6 mb-6 shadow-xs flex flex-col items-center justify-center text-center animate-pulse">
			<div className="relative w-12 h-12 mb-3 flex items-center justify-center">
				<div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-[#673AB7] via-[#8E24AA] to-[#1E88E5] opacity-25 animate-ping blur-xs" />
				<div className="relative w-10 h-10 rounded-lg bg-gradient-to-tr from-[#673AB7] to-[#8E24AA] flex items-center justify-center shadow-xs">
					<MdOutlineAutoAwesome className="text-white text-lg animate-spin [animation-duration:4s]" />
				</div>
			</div>
			<h4 className="text-sm font-bold text-[#1F1F1F]">
				Analyzing {totalResponses} response{totalResponses === 1 ? "" : "s"} with Gemini...
			</h4>
			<p className="text-xs text-[#5F6368] mt-1 font-normal">
				Detecting sentiment distribution, clustering patterns, and extracting recommendations...
			</p>
		</div>
	);
};

AIInsightsLoadingView.propTypes = {
	totalResponses: PropTypes.number.isRequired,
};

export default AIInsightsLoadingView;
