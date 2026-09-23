import PropTypes from "prop-types";
import { MdOutlineDescription } from "react-icons/md";
import SettingsCard from "./SettingsCard";
import SettingsToggleSwitch from "./SettingsToggleSwitch";

const PresentationSettingsCard = ({
	isExpanded,
	onToggle,
	confirmationMessage,
	showSubmitAnotherLink,
	onSettingChange,
}) => {
	return (
		<SettingsCard
			icon={MdOutlineDescription}
			title="Presentation"
			description="Manage post-submission experience"
			isExpanded={isExpanded}
			onToggle={onToggle}
		>
			{/* Confirmation Message */}
			<div>
				<p className="text-sm font-normal text-[#202124] mb-1">
					Confirmation message
				</p>
				<input
					type="text"
					value={confirmationMessage}
					onChange={(e) =>
						onSettingChange("confirmationMessage", e.target.value)
					}
					className="w-full text-sm border-b border-[#dadce0] focus:border-b-2 focus:border-[#673ab7] outline-none py-1.5 bg-transparent text-[#202124]"
					placeholder="Your response has been recorded."
				/>
			</div>

			<hr className="border-t border-[#f1f3f4]" />

			{/* Show link to submit another response */}
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm font-normal text-[#202124]">
						Show link to submit another response
					</p>
					<p className="text-xs text-[#5f6368] mt-0.5">
						Allow respondents to click &quot;Submit another response&quot;
					</p>
				</div>

				<SettingsToggleSwitch
					checked={showSubmitAnotherLink}
					onChange={(checked) =>
						onSettingChange("showSubmitAnotherLink", checked)
					}
				/>
			</div>
		</SettingsCard>
	);
};

PresentationSettingsCard.propTypes = {
	isExpanded: PropTypes.bool.isRequired,
	onToggle: PropTypes.func.isRequired,
	confirmationMessage: PropTypes.string.isRequired,
	showSubmitAnotherLink: PropTypes.bool.isRequired,
	onSettingChange: PropTypes.func.isRequired,
};

export default PresentationSettingsCard;
