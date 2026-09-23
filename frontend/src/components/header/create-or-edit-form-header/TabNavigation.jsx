import PropTypes from "prop-types";

const TabNavigation = ({ selectedBtn, setSelectedBtn, responseCount = 0 }) => {
	return (
		<div className="flex items-end justify-center gap-6 pt-3">
			{/* Questions Tab */}
			<div
				className="text-center cursor-pointer group"
				onClick={() => setSelectedBtn(0)}
			>
				<p
					className={`font-normal ${
						selectedBtn === 0 ? "text-[#4C2B87]" : "text-[#1f1f1f]"
					} text-sm mb-1 px-2`}
				>
					Questions
				</p>
				<div
					className={`w-full min-w-[87px] h-[3px] ${
						selectedBtn === 0 ? "bg-[#4C2B87]" : "bg-transparent"
					} rounded-t-[3px]`}
				/>
			</div>

			{/* Responses Tab with Count Badge */}
			<div
				className="text-center cursor-pointer group"
				onClick={() => setSelectedBtn(1)}
			>
				<div className="flex items-center justify-center gap-1.5 mb-1 px-2">
					<p
						className={`font-normal ${
							selectedBtn === 1 ? "text-[#4C2B87]" : "text-[#1f1f1f]"
						} text-sm`}
					>
						Responses
					</p>
					<span
						className={`text-xs px-2 py-0.5 rounded-full font-medium transition duration-150 ${
							selectedBtn === 1
								? "bg-[#4C2B87] text-white"
								: "bg-purple-100 text-[#673ab7] group-hover:bg-purple-200"
						}`}
					>
						{responseCount}
					</span>
				</div>
				<div
					className={`w-full min-w-[87px] h-[3px] ${
						selectedBtn === 1 ? "bg-[#4C2B87]" : "bg-transparent"
					} rounded-t-[3px]`}
				/>
			</div>

			{/* Settings Tab */}
			<div
				className="text-center cursor-pointer group"
				onClick={() => setSelectedBtn(2)}
			>
				<p
					className={`font-normal ${
						selectedBtn === 2 ? "text-[#4C2B87]" : "text-[#1f1f1f]"
					} text-sm mb-1 px-2`}
				>
					Settings
				</p>
				<div
					className={`w-full min-w-[87px] h-[3px] ${
						selectedBtn === 2 ? "bg-[#4C2B87]" : "bg-transparent"
					} rounded-t-[3px]`}
				/>
			</div>
		</div>
	);
};

TabNavigation.propTypes = {
	selectedBtn: PropTypes.number.isRequired,
	setSelectedBtn: PropTypes.func.isRequired,
	responseCount: PropTypes.number,
};

export default TabNavigation;
