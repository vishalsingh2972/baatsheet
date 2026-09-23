import { useState, useRef, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineContentCopy, MdCheck } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import PropTypes from "prop-types";
import useClickOutside from "../../hooks/useClickOutside";

const TtileDesFormIcons = ({
	onDelete,
	onDuplicate,
	hasHoverTextOption = false,
	hasHoverText = false,
	onToggleHoverText,
}) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const menuRef = useRef(null);

	useClickOutside(menuRef, () => setIsMenuOpen(false), isMenuOpen);

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

	return (
		<div className="flex items-center gap-2 relative">
			<div
				onClick={onDuplicate}
				className="p-3 rounded-full hover:bg-slate-100 cursor-pointer"
				title="Duplicate section"
			>
				<MdOutlineContentCopy fontSize="1.5em" color="#5f6368" />
			</div>

			<div
				onClick={onDelete}
				className="p-3 rounded-full hover:bg-slate-100 cursor-pointer"
				title="Delete section"
			>
				<RiDeleteBin6Line fontSize="1.5em" color="#5f6368" />
			</div>

			{/* 3-Dots Menu Trigger */}
			<div ref={menuRef} className="relative">
				<div
					onClick={() => setIsMenuOpen((prev) => !prev)}
					className={`p-3 rounded-full hover:bg-slate-100 cursor-pointer transition ${
						isMenuOpen ? "bg-slate-100" : ""
					}`}
					title="More options"
				>
					<BsThreeDotsVertical fontSize="1.5em" color="#5f6368" />
				</div>

				{/* 3-Dots Popover Menu */}
				{isMenuOpen && (
					<div
						className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-[#dadce0] py-2 z-30 animate-scaleUp"
						onClick={(e) => e.stopPropagation()}
					>
						{hasHoverTextOption && (
							<>
								<p className="text-xs font-semibold text-[#5f6368] px-4 pt-1 pb-1 uppercase tracking-wider">
									Show
								</p>
								<button
									type="button"
									onClick={() => {
										onToggleHoverText?.();
										setIsMenuOpen(false);
									}}
									className="w-full px-4 py-2 text-left text-sm text-[#202124] hover:bg-purple-50 flex items-center gap-3 transition duration-150 cursor-pointer"
								>
									<span className="w-5 flex items-center justify-center text-[#673ab7]">
										{hasHoverText && (
											<MdCheck className="text-xl" />
										)}
									</span>
									<span className="font-normal text-sm">
										Hover text
									</span>
								</button>
							</>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

TtileDesFormIcons.propTypes = {
	onDelete: PropTypes.func,
	onDuplicate: PropTypes.func,
	hasHoverTextOption: PropTypes.bool,
	hasHoverText: PropTypes.bool,
	onToggleHoverText: PropTypes.func,
};

export default TtileDesFormIcons;
