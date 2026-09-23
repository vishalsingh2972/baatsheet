import PropTypes from "prop-types";
import { MdOutlineClose, MdSearch } from "react-icons/md";

const HeaderFormSearch = ({ searchQuery = "", onSearchChange }) => {
	return (
		<div className="flex items-center w-full h-12 bg-[#f0f4f9] rounded-full pl-3 pr-4 transition-all duration-200 border border-transparent focus-within:bg-white focus-within:shadow-md focus-within:border-gray-200 overflow-hidden">
			<div className="p-1 rounded-full text-[#5f6368] flex-shrink-0">
				<MdSearch fontSize="1.5em" />
			</div>

			<input
				type="text"
				value={searchQuery}
				onChange={(e) => onSearchChange?.(e.target.value)}
				placeholder="Search"
				className="w-full h-full bg-transparent outline-none px-2 text-sm text-[#202124] placeholder-[#5f6368] font-normal"
			/>

			{searchQuery.length > 0 && (
				<button
					type="button"
					onClick={() => onSearchChange?.("")}
					className="p-1.5 rounded-full hover:bg-slate-200 cursor-pointer focus:outline-none transition duration-150 flex-shrink-0 text-[#5f6368]"
					title="Clear search"
				>
					<MdOutlineClose fontSize="1.35em" />
				</button>
			)}
		</div>
	);
};

HeaderFormSearch.propTypes = {
	searchQuery: PropTypes.string,
	onSearchChange: PropTypes.func,
};

export default HeaderFormSearch;
