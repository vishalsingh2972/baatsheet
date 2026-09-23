import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import FormattedText from "../../common/FormattedText";
import { MdOutlineCloudQueue } from "react-icons/md";

const PreviewFormTitleCard = ({
	headerImage,
	title,
	description,
	user,
	onSwitchAccount,
	redirectParam,
}) => {
	const navigate = useNavigate();

	return (
		<>
			{/* Standalone Header Banner if present */}
			{headerImage && (
				<div className="w-full h-[160px] md:h-[200px] rounded-lg overflow-hidden bg-white border border-[#dadce0] shadow-sm mb-3">
					<img
						src={headerImage}
						alt="Form header banner"
						className="w-full h-full object-cover"
					/>
				</div>
			)}

			{/* Top Form Title Card */}
			<div className="w-full bg-white rounded-lg border border-[#dadce0] border-t-8 border-t-[#673ab7] p-6 shadow-sm mb-4">
				<h1 className="text-2xl md:text-3xl font-normal text-[#202124] mb-3 break-words">
					<FormattedText text={title || "Untitled form"} />
				</h1>

				{description && (
					<p className="text-sm text-[#202124] whitespace-pre-wrap break-words mb-4 leading-relaxed">
						<FormattedText text={description} />
					</p>
				)}

				{/* Logged in User Account OR "Sign in to submit this form with your account." */}
				{user ? (
					<div className="mt-4 pt-3 border-t border-gray-200 text-sm text-[#202124] flex items-center justify-between flex-wrap gap-2">
						<div className="flex items-center gap-2">
							<span className="font-semibold text-slate-800">
								{user.email}
							</span>
							<button
								type="button"
								onClick={onSwitchAccount}
								className="text-[#1a73e8] hover:underline font-normal text-sm cursor-pointer"
							>
								Switch account
							</button>
						</div>
					</div>
				) : (
					<div className="mt-4 pt-3 border-t border-gray-200 text-xs text-[#5f6368] flex items-center justify-between flex-wrap gap-2">
						<div className="flex items-center gap-1.5">
							<MdOutlineCloudQueue className="text-base text-[#5f6368] shrink-0" />
							<span>Sign in to submit this form with your account.</span>
						</div>

						<button
							type="button"
							onClick={() => navigate(`/login?redirect=${redirectParam}`)}
							className="text-xs text-[#1a73e8] border border-[#dadce0] hover:bg-blue-50/50 font-medium px-3.5 py-1.5 rounded cursor-pointer transition shrink-0"
						>
							Sign in
						</button>
					</div>
				)}

				{/* Required Indicator */}
				<div className="mt-2.5 text-xs text-red-600">
					<span>* Indicates required question</span>
				</div>
			</div>
		</>
	);
};

PreviewFormTitleCard.propTypes = {
	headerImage: PropTypes.string,
	title: PropTypes.string,
	description: PropTypes.string,
	user: PropTypes.shape({
		email: PropTypes.string,
	}),
	onSwitchAccount: PropTypes.func.isRequired,
	redirectParam: PropTypes.string.isRequired,
};

export default PreviewFormTitleCard;
