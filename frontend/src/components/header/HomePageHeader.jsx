import PropTypes from "prop-types";
import Logo from "../logo/Logo";
import HeaderFormSearch from "./HeaderFormSearch";
import Profile from "./Profile";

const HomePageHeader = ({ searchQuery = "", onSearchChange }) => {
	return (
		<header className="flex items-center justify-between px-4 sm:px-8 py-2.5 w-full sticky top-0 bg-white z-40 gap-4 border-b border-transparent">
			<div className="flex-shrink-0">
				<Logo />
			</div>

			<div className="flex-1 max-w-[720px] mx-2 min-w-0 flex justify-center">
				<HeaderFormSearch
					searchQuery={searchQuery}
					onSearchChange={onSearchChange}
				/>
			</div>

			<div className="flex-shrink-0">
				<Profile />
			</div>
		</header>
	);
};

HomePageHeader.propTypes = {
	searchQuery: PropTypes.string,
	onSearchChange: PropTypes.func,
};

export default HomePageHeader;
