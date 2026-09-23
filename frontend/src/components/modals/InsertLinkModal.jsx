import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { MdOutlineInsertLink, MdClose } from "react-icons/md";

const InsertLinkModal = ({
	isOpen,
	onClose,
	initialText = "",
	initialUrl = "",
	onSave,
}) => {
	const [text, setText] = useState("");
	const [url, setUrl] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		if (isOpen) {
			setText(initialText || "");
			setUrl(initialUrl || "");
			setError("");
		}
	}, [isOpen, initialText, initialUrl]);

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

	const handleDone = () => {
		if (!url.trim()) {
			setError("Please provide a valid web address (URL).");
			return;
		}

		let cleanUrl = url.trim();
		if (
			!cleanUrl.startsWith("http://") &&
			!cleanUrl.startsWith("https://")
		) {
			cleanUrl = `https://${cleanUrl}`;
		}

		onSave({
			text: text.trim() || cleanUrl,
			url: cleanUrl,
		});
		onClose();
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in"
			onClick={onClose}
		>
			<div
				className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col"
				onClick={(e) => e.stopPropagation()}
				onMouseDown={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-[#dadce0]">
					<div className="flex items-center gap-2">
						<MdOutlineInsertLink className="text-2xl text-[#673ab7]" />
						<h3 className="text-lg font-medium text-[#202124]">
							Insert link
						</h3>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="p-1 rounded-full text-[#5f6368] hover:bg-gray-100 transition cursor-pointer"
					>
						<MdClose className="text-xl" />
					</button>
				</div>

				{/* Body */}
				<div className="p-6 flex flex-col gap-4">
					<div>
						<label className="block text-xs font-semibold text-[#5f6368] uppercase tracking-wider mb-1.5">
							Text to display
						</label>
						<input
							type="text"
							value={text}
							onChange={(e) => setText(e.target.value)}
							placeholder="Display text"
							className="w-full text-sm border border-[#dadce0] rounded-lg px-3 py-2 outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition"
						/>
					</div>

					<div>
						<label className="block text-xs font-semibold text-[#5f6368] uppercase tracking-wider mb-1.5">
							Link URL
						</label>
						<input
							type="url"
							value={url}
							onChange={(e) => {
								setUrl(e.target.value);
								setError("");
							}}
							placeholder="https://example.com"
							className="w-full text-sm border border-[#dadce0] rounded-lg px-3 py-2 outline-none focus:border-[#673ab7] focus:ring-1 focus:ring-[#673ab7] transition"
							autoFocus
						/>
					</div>

					{error && (
						<p className="text-xs text-red-500 font-medium">
							{error}
						</p>
					)}
				</div>

				{/* Footer */}
				<div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-[#dadce0]">
					<button
						type="button"
						onClick={onClose}
						className="px-4 py-2 text-sm font-medium text-[#5f6368] hover:text-[#202124] hover:bg-gray-200/60 rounded-md transition cursor-pointer"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={handleDone}
						className="px-5 py-2 text-sm font-medium text-white bg-[#673ab7] hover:bg-[#5a2ea6] rounded-md shadow-xs transition cursor-pointer"
					>
						OK
					</button>
				</div>
			</div>
		</div>
	);
};

InsertLinkModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	initialText: PropTypes.string,
	initialUrl: PropTypes.string,
	onSave: PropTypes.func.isRequired,
};

export default InsertLinkModal;
