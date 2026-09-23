import PropTypes from "prop-types";
import { useEffect } from "react";
import { BsTrash } from "react-icons/bs";

const DeleteFormModal = ({ isOpen, formName, onConfirm, onClose }) => {
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape") onClose();
		};
		if (isOpen) {
			window.addEventListener("keydown", handleKeyDown);
		}
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn"
			onClick={onClose}
		>
			<div
				className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-scaleUp"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Top Icon & Title */}
				<div className="flex items-center gap-3.5 mb-3">
					<div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
						<BsTrash className="text-xl" />
					</div>
					<div>
						<h2 className="text-lg font-semibold text-[#202124]">
							Delete form?
						</h2>
						<p className="text-xs text-gray-500 truncate max-w-[280px]">
							{formName || "Untitled form"}
						</p>
					</div>
				</div>

				{/* Body Description */}
				<p className="text-sm text-gray-600 mb-6 leading-relaxed">
					Are you sure you want to delete <span className="font-semibold text-gray-900">&quot;{formName || "Untitled form"}&quot;</span>? This will permanently remove the form and all of its collected responses.
				</p>

				{/* Footer Buttons */}
				<div className="flex items-center justify-end gap-3 pt-2">
					<button
						type="button"
						onClick={onClose}
						className="px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-full transition duration-150 cursor-pointer"
					>
						Cancel
					</button>

					<button
						type="button"
						onClick={onConfirm}
						className="px-6 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-full shadow-sm transition duration-150 cursor-pointer"
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

DeleteFormModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	formName: PropTypes.string,
	onConfirm: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default DeleteFormModal;
