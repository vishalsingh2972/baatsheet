import PropTypes from "prop-types";
import {
	MdErrorOutline,
	MdCheckBox,
	MdCheckBoxOutlineBlank,
} from "react-icons/md";

const PreviewEmailCard = ({
	collectEmailMode,
	userEmail,
	recordEmailChecked,
	onToggleRecordEmail,
	respondentEmail,
	onRespondentEmailChange,
	emailError,
}) => {
	// If form does not collect email, render nothing
	if (!collectEmailMode || collectEmailMode === "do_not_collect") {
		return null;
	}

	// 1. Verified Account Consent Card with Form-styled Checkbox
	if (collectEmailMode === "verified") {
		return (
			<div
				id="field-email"
				className={`w-full bg-white rounded-lg border p-6 shadow-sm mb-4 transition duration-150 scroll-mt-24 ${
					emailError ? "border-red-500" : "border-[#dadce0]"
				}`}
			>
				<div className="mb-3">
					<p className="text-base font-normal text-[#202124]">
						Email <span className="text-red-500">*</span>
					</p>
				</div>

				<div
					onClick={onToggleRecordEmail}
					className="flex items-start gap-3 cursor-pointer text-sm text-[#202124] select-none group py-0.5"
				>
					<div className="flex-shrink-0 transition duration-150 mt-0.5">
						{recordEmailChecked ? (
							<MdCheckBox
								fontSize="1.7em"
								className="text-[#673ab7]"
							/>
						) : (
							<MdCheckBoxOutlineBlank
								fontSize="1.7em"
								className="text-[#5f6368] group-hover:text-[#202124]"
							/>
						)}
					</div>
					<span className="leading-snug">
						Record{" "}
						<strong className="font-semibold text-slate-900">
							{userEmail || "your email"}
						</strong>{" "}
						as the email to be included with my response
					</span>
				</div>

				{emailError && (
					<div className="flex items-center gap-1.5 text-red-500 text-xs mt-3">
						<MdErrorOutline fontSize="1.2em" />
						<span>
							You must consent to record your email address to submit this form
						</span>
					</div>
				)}
			</div>
		);
	}

	// 2. Responder Input Manual Email Collection Card
	if (collectEmailMode === "responder_input") {
		return (
			<div
				id="field-email"
				className={`w-full bg-white rounded-lg border p-6 shadow-sm mb-4 transition duration-150 scroll-mt-24 ${
					emailError ? "border-red-500" : "border-[#dadce0]"
				}`}
			>
				<div className="mb-4">
					<p className="text-base font-normal text-[#202124]">
						Email <span className="text-red-500">*</span>
					</p>
				</div>

				<div className="w-full max-w-sm">
					<input
						type="email"
						value={respondentEmail}
						onChange={(e) => onRespondentEmailChange(e.target.value)}
						placeholder="Your email"
						className="w-full border-b border-[#dadce0] focus:border-b-2 focus:border-[#673ab7] outline-none text-sm text-[#202124] placeholder-[#70757a] pb-1.5 bg-transparent transition-colors duration-150"
					/>
				</div>

				{emailError && (
					<div className="flex items-center gap-1.5 text-red-500 text-xs mt-3">
						<MdErrorOutline fontSize="1.2em" />
						<span>Must be a valid email address</span>
					</div>
				)}
			</div>
		);
	}

	return null;
};

PreviewEmailCard.propTypes = {
	collectEmailMode: PropTypes.string,
	userEmail: PropTypes.string,
	recordEmailChecked: PropTypes.bool,
	onToggleRecordEmail: PropTypes.func,
	respondentEmail: PropTypes.string,
	onRespondentEmailChange: PropTypes.func,
	emailError: PropTypes.bool,
};

export default PreviewEmailCard;
