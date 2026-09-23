import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { MdOutlineSort, MdArrowDropDown, MdCheck } from "react-icons/md";

const SORT_OPTIONS = [
	{ id: "last_modified_desc", label: "Last modified" },
	{ id: "last_modified_asc", label: "Last modified (Oldest first)" },
	{ id: "title_asc", label: "Title (A to Z)" },
	{ id: "title_desc", label: "Title (Z to A)" },
	{ id: "created_desc", label: "Date created (Newest first)" },
];

const FormsSortDropdown = ({ currentSort, onSortChange }) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);

	// Close on click outside
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target)
			) {
				setIsOpen(false);
			}
		};
		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, [isOpen]);

	const currentOption =
		SORT_OPTIONS.find((opt) => opt.id === currentSort) || SORT_OPTIONS[0];

	return (
		<div className="relative inline-block text-left" ref={dropdownRef}>
			{/* Trigger Button */}
			<button
				type="button"
				onClick={() => setIsOpen((prev) => !prev)}
				className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition duration-150 cursor-pointer ${
					isOpen
						? "bg-purple-50 text-[#673ab7] border-purple-300"
						: "bg-white text-[#5f6368] border-gray-200 hover:text-[#202124] hover:bg-gray-50"
				}`}
				title="Sort forms"
			>
				<MdOutlineSort className="text-base text-gray-500 flex-shrink-0" />
				<span className="truncate max-w-[130px] sm:max-w-none">
					{currentOption.label}
				</span>
				<MdArrowDropDown className="text-lg text-gray-400 flex-shrink-0" />
			</button>

			{/* Dropdown Menu */}
			{isOpen && (
				<div className="absolute right-0 mt-1.5 w-56 rounded-xl bg-white shadow-xl border border-gray-100 py-1.5 z-30 animate-fadeIn">
					<div className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1">
						Sort by
					</div>

					{SORT_OPTIONS.map((option) => {
						const isSelected = option.id === currentSort;
						return (
							<button
								key={option.id}
								type="button"
								onClick={() => {
									onSortChange(option.id);
									setIsOpen(false);
								}}
								className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition duration-150 cursor-pointer ${
									isSelected
										? "bg-purple-50 text-[#673ab7] font-semibold"
										: "text-[#202124] hover:bg-gray-50"
								}`}
							>
								<span>{option.label}</span>
								{isSelected && (
									<MdCheck className="text-base text-[#673ab7] flex-shrink-0 ml-2" />
								)}
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
};

FormsSortDropdown.propTypes = {
	currentSort: PropTypes.string.isRequired,
	onSortChange: PropTypes.func.isRequired,
};

export default FormsSortDropdown;
