import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import LogoImage from "../../logo/LogoImage";
import Profile from "../Profile";
import StarButton from "./StarButton";
import HeaderIcons from "./HeaderIcons";
import TabNavigation from "./TabNavigation";
import DocumentTitleInput from "./DocumentTitleInput";
import SaveStatusIndicator from "./SaveStatusIndicator";
import { useGetFormResponsesQuery } from "../../../redux/api/formApi";

const CreateOrEditHeader = ({
	formId,
	formName = "Untitled form",
	headerImage = "",
	onHeaderImageChange,
	isStarred = false,
	onNameChange,
	selectedBtn = 0,
	setSelectedBtn,
	saveStatus = "idle",
	onSaveStatusChange,
	canUndo = false,
	canRedo = false,
	onUndo,
	onRedo,
}) => {
	const { data: responses } = useGetFormResponsesQuery(formId, {
		skip: !formId,
		pollingInterval: 5000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});
	const responseCount = responses?.length || 0;

	return (
		<header className="border-b border-[#DADCE0] w-full fixed z-40 bg-white shadow-sm">
			<div className="flex items-center justify-between px-5 py-2">
				<div className="flex items-center">
					<Link to="/">
						<LogoImage />
					</Link>

					<DocumentTitleInput
						formId={formId}
						formName={formName}
						onNameChange={onNameChange}
						onSaveStatusChange={onSaveStatusChange}
					/>

					<StarButton formId={formId} isStarred={isStarred} />

					<SaveStatusIndicator saveStatus={saveStatus} />
				</div>

				<div className="flex items-center gap-3">
					<HeaderIcons
						formId={formId}
						formName={formName}
						headerImage={headerImage}
						onHeaderImageChange={onHeaderImageChange}
						canUndo={canUndo}
						canRedo={canRedo}
						onUndo={onUndo}
						onRedo={onRedo}
					/>
					<Profile />
				</div>
			</div>

			<TabNavigation
				selectedBtn={selectedBtn}
				setSelectedBtn={setSelectedBtn}
				responseCount={responseCount}
			/>
		</header>
	);
};

CreateOrEditHeader.propTypes = {
	formId: PropTypes.string,
	formName: PropTypes.string,
	headerImage: PropTypes.string,
	onHeaderImageChange: PropTypes.func,
	isStarred: PropTypes.bool,
	onNameChange: PropTypes.func,
	selectedBtn: PropTypes.number,
	setSelectedBtn: PropTypes.func,
	saveStatus: PropTypes.string,
	onSaveStatusChange: PropTypes.func,
	canUndo: PropTypes.bool,
	canRedo: PropTypes.bool,
	onUndo: PropTypes.func,
	onRedo: PropTypes.func,
};

export default CreateOrEditHeader;
