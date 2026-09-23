import PropTypes from "prop-types";
import { MdOutlineEmail } from "react-icons/md";
import SettingsCard from "./SettingsCard";
import SettingsToggleSwitch from "./SettingsToggleSwitch";

const ResponsesSettingsCard = ({
	isExpanded,
	onToggle,
	collectEmail,
	limitOneResponse,
	onSettingChange,
}) => {
	return (
		<SettingsCard
			icon={MdOutlineEmail}
			title="Responses"
			description="Manage how responses are collected and protected"
			isExpanded={isExpanded}
			onToggle={onToggle}
		>
			{/* Collect Email Addresses */}
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm font-normal text-[#202124]">
						Collect email addresses
					</p>
					<p className="text-xs text-[#5f6368] mt-0.5">
						Ask respondents for their email address on the form
					</p>
				</div>

				<select
					value={collectEmail}
					onChange={(e) =>
						onSettingChange("collectEmail", e.target.value)
					}
					className="text-sm border border-[#dadce0] rounded px-3 py-1.5 bg-white text-[#202124] focus:outline-none focus:border-[#673ab7] cursor-pointer"
				>
					<option value="none">Do not collect</option>
					<option value="responder_input">
						Responder input (Required)
					</option>
					<option value="verified">Verified account</option>
				</select>
			</div>

			<hr className="border-t border-[#f1f3f4]" />

			{/* Limit to 1 Response */}
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm font-normal text-[#202124]">
						Limit to 1 response
					</p>
					<p className="text-xs text-[#5f6368] mt-0.5">
						Requires respondents to sign in with an account
					</p>
				</div>

				<SettingsToggleSwitch
					checked={limitOneResponse}
					onChange={(checked) =>
						onSettingChange("limitOneResponse", checked)
					}
				/>
			</div>
		</SettingsCard>
	);
};

ResponsesSettingsCard.propTypes = {
	isExpanded: PropTypes.bool.isRequired,
	onToggle: PropTypes.func.isRequired,
	collectEmail: PropTypes.string.isRequired,
	limitOneResponse: PropTypes.bool.isRequired,
	onSettingChange: PropTypes.func.isRequired,
};

export default ResponsesSettingsCard;
