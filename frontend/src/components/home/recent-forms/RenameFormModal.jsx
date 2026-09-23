import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const RenameFormModal = ({ isOpen, currentName, onConfirm, onClose }) => {
	const [inputValue, setInputValue] = useState(currentName || "");
	const inputRef = useRef(null);

	// Sync input when modal opens with the latest name
	useEffect(() => {
		if (isOpen) {
			setInputValue(currentName || "");
			// Auto-focus and select all text
			setTimeout(() => {
				inputRef.current?.focus();
				inputRef.current?.select();
			}, 50);
		}
	}, [isOpen, currentName]);

	const handleConfirm = () => {
		const finalName = inputValue.trim() || "Untitled form";
		onConfirm(finalName);
		onClose();
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") handleConfirm();
		if (e.key === "Escape") onClose();
	};

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
			onClick={onClose}
		>
			<div
				className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6"
				onClick={(e) => e.stopPropagation()}
			>
				<h2 className="text-base font-medium text-[#202124] mb-4">
					Rename form
				</h2>

				<input
					ref={inputRef}
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Untitled form"
					className="w-full border-b-2 border-[#673ab7] outline-none text-sm text-[#202124] py-1 px-0 bg-transparent mb-6"
				/>

				<div className="flex justify-end gap-2">
					<button
						onClick={onClose}
						className="px-5 py-2 text-sm font-medium text-[#673ab7] rounded-full hover:bg-purple-50 transition duration-150"
					>
						Cancel
					</button>
					<button
						onClick={handleConfirm}
						className="px-5 py-2 text-sm font-medium text-white bg-[#673ab7] rounded-full hover:bg-[#5a2ea6] transition duration-150"
					>
						OK
					</button>
				</div>
			</div>
		</div>
	);
};

RenameFormModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	currentName: PropTypes.string,
	onConfirm: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default RenameFormModal;
