import PropTypes from "prop-types";
import { useEffect } from "react";
import { BsTrash } from "react-icons/bs";

const DeleteResponsesModal = ({
	isOpen,
	formName,
	responseCount = 0,
	onConfirm,
	onClose,
	isLoading = false,
}) => {
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape" && !isLoading) onClose();
		};
		if (isOpen) {
			window.addEventListener("keydown", handleKeyDown);
		}
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose, isLoading]);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn"
			onClick={!isLoading ? onClose : undefined}
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
							Delete all responses?
						</h2>
						<p className="text-xs text-gray-500 truncate max-w-[280px]">
							{formName || "Untitled form"}
						</p>
					</div>
				</div>

				{/* Body Description */}
				<p className="text-sm text-gray-600 mb-6 leading-relaxed">
					Are you sure you want to delete all{" "}
					<span className="font-semibold text-gray-900">
						{responseCount} response{responseCount === 1 ? "" : "s"}
					</span>{" "}
					for &quot;{formName || "Untitled form"}&quot;? This action
					cannot be undone and will permanently remove all submitted
					records.
				</p>

				{/* Footer Buttons */}
				<div className="flex items-center justify-end gap-3 pt-2">
					<button
						type="button"
						onClick={onClose}
						disabled={isLoading}
						className="px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-full transition duration-150 cursor-pointer disabled:opacity-50"
					>
						Cancel
					</button>

					<button
						type="button"
						onClick={onConfirm}
						disabled={isLoading}
						className="px-6 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-full shadow-sm transition duration-150 cursor-pointer disabled:opacity-50 flex items-center gap-2"
					>
						{isLoading ? (
							<>
								<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
								<span>Deleting...</span>
							</>
						) : (
							"Delete all"
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

DeleteResponsesModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	formName: PropTypes.string,
	responseCount: PropTypes.number,
	onConfirm: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
	isLoading: PropTypes.bool,
};

export default DeleteResponsesModal;
