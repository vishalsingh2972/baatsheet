import PropTypes from "prop-types";
import { MdOutlineSchedule } from "react-icons/md";
import SettingsCard from "./SettingsCard";
import SettingsToggleSwitch from "./SettingsToggleSwitch";

const DeadlinesSettingsCard = ({
	isExpanded,
	onToggle,
	isAcceptingResponses,
	deadline,
	closedFormMessage,
	onSettingChange,
}) => {
	return (
		<SettingsCard
			icon={MdOutlineSchedule}
			title="Submission Deadlines & Status"
			description="Control form availability and expiration schedules"
			isExpanded={isExpanded}
			onToggle={onToggle}
		>
			{/* Accepting Responses Master Toggle */}
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm font-normal text-[#202124]">
						Accepting responses
					</p>
					<p className="text-xs text-[#5f6368] mt-0.5">
						Turn off to manually close submissions immediately
					</p>
				</div>

				<SettingsToggleSwitch
					checked={isAcceptingResponses}
					onChange={(checked) =>
						onSettingChange("isAcceptingResponses", checked)
					}
				/>
			</div>

			<hr className="border-t border-[#f1f3f4]" />

			{/* Submission Deadline */}
			<div className="flex items-start justify-between">
				<div>
					<p className="text-sm font-normal text-[#202124]">
						Submission deadline
					</p>
					<p className="text-xs text-[#5f6368] mt-0.5">
						Automatically stop accepting responses at a specific date and time
					</p>
				</div>

				<div className="flex items-center gap-2">
					<input
						type="datetime-local"
						value={deadline}
						onChange={(e) =>
							onSettingChange("deadline", e.target.value)
						}
						className="text-sm border border-[#dadce0] rounded px-3 py-1.5 bg-white text-[#202124] focus:outline-none focus:border-[#673ab7] cursor-pointer"
					/>
					{deadline && (
						<button
							type="button"
							onClick={() => onSettingChange("deadline", "")}
							className="text-xs text-red-600 hover:bg-red-50 px-2 py-1.5 rounded transition cursor-pointer"
						>
							Clear
						</button>
					)}
				</div>
			</div>

			<hr className="border-t border-[#f1f3f4]" />

			{/* Message for closed form */}
			<div>
				<p className="text-sm font-normal text-[#202124] mb-1">
					Message for respondents when closed
				</p>
				<input
					type="text"
					value={closedFormMessage}
					onChange={(e) =>
						onSettingChange("closedFormMessage", e.target.value)
					}
					className="w-full text-sm border-b border-[#dadce0] focus:border-b-2 focus:border-[#673ab7] outline-none py-1.5 bg-transparent text-[#202124]"
					placeholder="This form is no longer accepting responses."
				/>
			</div>
		</SettingsCard>
	);
};

DeadlinesSettingsCard.propTypes = {
	isExpanded: PropTypes.bool.isRequired,
	onToggle: PropTypes.func.isRequired,
	isAcceptingResponses: PropTypes.bool.isRequired,
	deadline: PropTypes.string.isRequired,
	closedFormMessage: PropTypes.string.isRequired,
	onSettingChange: PropTypes.func.isRequired,
};

export default DeadlinesSettingsCard;
