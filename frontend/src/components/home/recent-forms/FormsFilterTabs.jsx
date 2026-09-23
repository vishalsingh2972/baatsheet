import PropTypes from "prop-types";

const FormsFilterTabs = ({
	filterTab,
	onFilterChange,
	allCount = 0,
	starredCount = 0,
}) => {
	return (
		<div className="flex items-center gap-1 bg-[#f1f3f4] p-1 rounded-lg text-xs font-medium">
			<button
				type="button"
				onClick={() => onFilterChange("all")}
				className={`px-3 py-1.5 rounded-md transition duration-150 ${
					filterTab === "all"
						? "bg-white text-[#673ab7] shadow-sm font-semibold"
						: "text-[#5f6368] hover:text-[#202124]"
				}`}
			>
				All ({allCount})
			</button>
			<button
				type="button"
				onClick={() => onFilterChange("starred")}
				className={`px-3 py-1.5 rounded-md transition duration-150 ${
					filterTab === "starred"
						? "bg-white text-[#673ab7] shadow-sm font-semibold"
						: "text-[#5f6368] hover:text-[#202124]"
				}`}
			>
				Starred ({starredCount})
			</button>
		</div>
	);
};

FormsFilterTabs.propTypes = {
	filterTab: PropTypes.oneOf(["all", "starred"]).isRequired,
	onFilterChange: PropTypes.func.isRequired,
	allCount: PropTypes.number,
	starredCount: PropTypes.number,
};

export default FormsFilterTabs;
