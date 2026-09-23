import { useState } from "react";
import HomePageHeader from "../components/header/HomePageHeader";
import BlankForm from "../components/home/BlankForm";
import RecentForms from "../components/home/recent-forms/RecentForms";

const HomePage = () => {
	const [searchQuery, setSearchQuery] = useState("");

	return (
		<>
			<HomePageHeader
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
			/>

			{/* your home page content */}
			<BlankForm />

			{/* recent forms */}
			<RecentForms
				searchQuery={searchQuery}
				onClearSearch={() => setSearchQuery("")}
			/>
		</>
	);
};

export default HomePage;
