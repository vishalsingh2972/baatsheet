import { useState } from "react";
import PropTypes from "prop-types";
import { HiOutlineX, HiOutlineLink } from "react-icons/hi";

const ShareFormModal = ({ isOpen, onClose, formId, formTitle }) => {
	const [shortenUrl, setShortenUrl] = useState(false);
	const [copied, setCopied] = useState(false);

	if (!isOpen) return null;

	const origin = window.location.origin;
	const fullUrl = `${origin}/forms/${formId}/view`;
	const shortUrl = `${origin}/forms/${formId ? formId.slice(-8) : ""}/view`;
	const currentUrl = shortenUrl ? shortUrl : fullUrl;

	const handleCopy = () => {
		if (navigator.clipboard) {
			navigator.clipboard.writeText(currentUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 3000);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
			<div
				className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-lg w-full p-6 relative animate-scaleUp"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Close Button */}
				<button
					type="button"
					onClick={onClose}
					className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition duration-150 focus:outline-none cursor-pointer"
					title="Close"
				>
					<HiOutlineX className="text-xl" />
				</button>

				{/* Header */}
				<div className="flex items-center gap-3 mb-4">
					<div className="w-10 h-10 rounded-xl bg-[#673ab7]/10 text-[#673ab7] flex items-center justify-center">
						<HiOutlineLink className="text-xl" />
					</div>
					<div>
						<h3 className="text-xl font-bold text-gray-900">
							Share form
						</h3>
						<p className="text-xs text-gray-500 truncate max-w-[340px]">
							{formTitle || "Untitled form"}
						</p>
					</div>
				</div>

				<p className="text-sm text-gray-600 mb-3">
					Anyone with this link can view and submit responses:
				</p>

				{/* Link Input Box */}
				<div className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 mb-3 focus-within:border-[#673ab7] focus-within:ring-1 focus-within:ring-[#673ab7]">
					<input
						type="text"
						readOnly
						value={currentUrl}
						className="w-full bg-transparent text-sm text-gray-800 outline-none select-all"
					/>
				</div>

				{/* Shorten URL Checkbox */}
				<div className="flex items-center gap-2 mb-6 select-none">
					<input
						type="checkbox"
						id="shorten-url"
						checked={shortenUrl}
						onChange={(e) => setShortenUrl(e.target.checked)}
						className="w-4 h-4 text-[#673ab7] rounded border-gray-300 focus:ring-[#673ab7] cursor-pointer"
					/>
					<label
						htmlFor="shorten-url"
						className="text-sm text-gray-600 cursor-pointer"
					>
						Shorten URL
					</label>
				</div>

				{/* Action Buttons: Left = Copy link, Right = Done (Theme color) */}
				<div className="flex items-center justify-between pt-3 border-t border-gray-100">
					<button
						type="button"
						onClick={handleCopy}
						className="px-5 py-2.5 bg-purple-50 hover:bg-purple-100 text-[#673ab7] border border-purple-200 text-sm font-medium rounded-xl transition duration-150 cursor-pointer inline-flex items-center gap-1.5"
					>
						<span>{copied ? "Copied!" : "Copy link"}</span>
					</button>

					<button
						type="button"
						onClick={onClose}
						className="px-7 py-2.5 bg-[#673ab7] hover:bg-[#5a2ea6] text-white text-sm font-medium rounded-xl shadow-sm transition duration-150 cursor-pointer"
					>
						Done
					</button>
				</div>

				{/* Toast Banner */}
				{copied && (
					<div className="absolute -bottom-14 left-0 bg-[#202124] text-white text-sm px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-fadeIn z-50">
						<span>Link copied to clipboard</span>
					</div>
				)}
			</div>
		</div>
	);
};

ShareFormModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	formId: PropTypes.string,
	formTitle: PropTypes.string,
};

export default ShareFormModal;
