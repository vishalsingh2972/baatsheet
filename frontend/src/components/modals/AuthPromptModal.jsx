/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { HiOutlineLockClosed, HiOutlineX } from "react-icons/hi";

const AuthPromptModal = ({
	isOpen,
	onClose,
	title = "Sign in Required",
	message = "Sign in or create an account to continue.",
	redirectUrl = "/login?redirect=/forms/create",
}) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
			<div
				className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full p-6 relative animate-scaleUp"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Close Button */}
				<button
					type="button"
					onClick={onClose}
					className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition duration-150 focus:outline-none cursor-pointer"
				>
					<HiOutlineX className="text-xl" />
				</button>

				{/* Lock Icon Badge */}
				<div className="w-12 h-12 rounded-2xl bg-[#673ab7]/10 text-[#673ab7] flex items-center justify-center mb-4">
					<HiOutlineLockClosed className="text-2xl" />
				</div>

				{/* Title & Message */}
				<h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
				<p className="text-sm text-gray-500 mb-6 leading-relaxed">
					{message}
				</p>

				{/* Actions */}
				<div className="flex flex-col sm:flex-row gap-3">
					<Link
						to={redirectUrl}
						className="flex-1 inline-flex items-center justify-center px-5 py-2.5 bg-[#673ab7] hover:bg-[#5a2ea6] text-white text-sm font-medium rounded-xl shadow-sm transition duration-150 cursor-pointer"
					>
						Sign In
					</Link>
					<button
						type="button"
						onClick={onClose}
						className="flex-1 inline-flex items-center justify-center px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-sm font-medium rounded-xl transition duration-150 cursor-pointer"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default AuthPromptModal;
