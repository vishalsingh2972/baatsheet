import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { BsThreeDotsVertical, BsTrash } from "react-icons/bs";
import { MdOutlineFileDownload } from "react-icons/md";
import useClickOutside from "../../hooks/useClickOutside";

const ResponsesHeader = ({
	totalResponses,
	formTitle,
	onExportCSV,
	onDeleteAllClick,
	isAcceptingResponses = true,
	onToggleAcceptingResponses,
}) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const menuContainerRef = useRef(null);

	useClickOutside(
		menuContainerRef,
		() => setIsMenuOpen(false),
		isMenuOpen
	);

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape" && isMenuOpen) {
				setIsMenuOpen(false);
			}
		};
		if (isMenuOpen) {
			window.addEventListener("keydown", handleKeyDown);
		}
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isMenuOpen]);

	const tooltipText = isAcceptingResponses
		? "Accepting responses (Click to close)"
		: "Not accepting responses (Click to accept)";

	return (
		<div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
			{/* Left: Response Counter */}
			<div>
				<h2 className="text-2xl font-bold text-gray-900">
					{totalResponses}{" "}
					{totalResponses === 1 ? "Response" : "Responses"}
				</h2>
				<p className="text-xs text-gray-500 mt-1">
					{formTitle || "Form"} responses list
				</p>
			</div>

			{/* Right: Toggle Switch & 3-Dots Menu */}
			<div className="flex items-center gap-3">
				{/* Accepting Responses Master Toggle Switch with Tooltip */}
				<div className="relative group flex items-center">
					<label
						className="relative inline-flex items-center cursor-pointer p-1.5 rounded-full hover:bg-purple-50 transition duration-150"
						title={tooltipText}
					>
						<input
							type="checkbox"
							checked={isAcceptingResponses}
							onChange={(e) =>
								onToggleAcceptingResponses?.(e.target.checked)
							}
							className="sr-only peer"
						/>
						<div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[8px] after:left-[8px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:shadow-sm after:transition-all peer-checked:bg-[#673ab7]"></div>
					</label>

					{/* Floating Tooltip Bubble */}
					<div className="absolute right-0 bottom-full mb-2 hidden group-hover:flex items-center whitespace-nowrap bg-[#202124] text-white text-[11px] font-medium py-1 px-2.5 rounded-md shadow-md pointer-events-none z-20">
						{tooltipText}
					</div>
				</div>

				{/* 3-Dots Dropdown Menu */}
				<div ref={menuContainerRef} className="relative">
					<button
						type="button"
						onClick={() => setIsMenuOpen((prev) => !prev)}
						className={`p-2 rounded-full hover:bg-slate-100 cursor-pointer focus:outline-none transition duration-150 ${
							isMenuOpen ? "bg-slate-100" : ""
						}`}
						title="More options"
					>
						<BsThreeDotsVertical fontSize="1.2em" color="#5f6368" />
					</button>

					{isMenuOpen && (
						<div
							className="absolute right-0 top-full mt-1.5 min-w-[260px] bg-white rounded-lg shadow-xl border border-[#dadce0] py-1.5 z-30 animate-scaleUp"
							onClick={(e) => e.stopPropagation()}
						>
							{/* Download .CSV option */}
							<button
								type="button"
								disabled={totalResponses === 0}
								onClick={() => {
									setIsMenuOpen(false);
									onExportCSV();
								}}
								className="w-full px-4 py-2.5 text-left text-sm text-[#202124] hover:bg-slate-100 flex items-center gap-3 transition duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
							>
								<MdOutlineFileDownload className="text-xl text-[#5f6368] flex-shrink-0" />
								<span className="whitespace-nowrap">
									Download responses (.csv)
								</span>
							</button>

							<div className="h-px bg-gray-200 my-1" />

							{/* Delete All Responses option */}
							<button
								type="button"
								disabled={totalResponses === 0}
								onClick={() => {
									setIsMenuOpen(false);
									onDeleteAllClick();
								}}
								className="w-full px-4 py-2.5 text-left text-sm text-[#202124] hover:bg-red-50 hover:text-red-600 flex items-center gap-3 transition duration-150 cursor-pointer group disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
							>
								<BsTrash className="text-base text-[#5f6368] group-hover:text-red-600 flex-shrink-0 transition-colors" />
								<span className="whitespace-nowrap">
									Delete all responses
								</span>
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

ResponsesHeader.propTypes = {
	totalResponses: PropTypes.number.isRequired,
	formTitle: PropTypes.string,
	onExportCSV: PropTypes.func.isRequired,
	onDeleteAllClick: PropTypes.func.isRequired,
	isAcceptingResponses: PropTypes.bool,
	onToggleAcceptingResponses: PropTypes.func,
};

export default ResponsesHeader;
