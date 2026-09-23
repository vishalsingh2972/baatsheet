import { useEffect, useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { MdOutlineEdit, MdOutlineLinkOff } from "react-icons/md";

const LinkPreviewPopover = ({
	onEditLink,
	onRemoveLink,
	isModalOpen = false,
}) => {
	const [activeAnchor, setActiveAnchor] = useState(null);
	const [position, setPosition] = useState({ top: 0, left: 0 });
	const isHoveringPopoverRef = useRef(false);
	const popoverRef = useRef(null);

	const updatePopoverFromAnchor = useCallback(
		(anchor) => {
			if (isModalOpen) {
				setActiveAnchor(null);
				return;
			}

			if (!anchor || !anchor.isConnected) {
				if (!isHoveringPopoverRef.current) {
					setActiveAnchor(null);
				}
				return;
			}

			const rect = anchor.getBoundingClientRect();
			setActiveAnchor(anchor);
			setPosition({
				top: Math.max(8, rect.top - 48),
				left: Math.max(8, rect.left),
			});
		},
		[isModalOpen]
	);

	const checkSelection = useCallback(() => {
		if (isModalOpen || isHoveringPopoverRef.current) return;

		const sel = window.getSelection();
		if (!sel || !sel.anchorNode) {
			setActiveAnchor(null);
			return;
		}

		const anchor =
			sel.anchorNode.nodeType === Node.ELEMENT_NODE
				? sel.anchorNode.closest("a")
				: sel.anchorNode.parentElement?.closest("a");

		if (anchor && anchor.isContentEditable) {
			updatePopoverFromAnchor(anchor);
		} else {
			setActiveAnchor(null);
		}
	}, [isModalOpen, updatePopoverFromAnchor]);

	useEffect(() => {
		if (isModalOpen) {
			setActiveAnchor(null);
		}
	}, [isModalOpen]);

	useEffect(() => {
		const handleDocumentClick = (e) => {
			if (isModalOpen) return;

			const clickedAnchor = e.target.closest?.("a[contenteditable], a");
			if (clickedAnchor && clickedAnchor.isContentEditable) {
				updatePopoverFromAnchor(clickedAnchor);
				return;
			}

			if (popoverRef.current && popoverRef.current.contains(e.target)) {
				return;
			}

			if (!isHoveringPopoverRef.current) {
				checkSelection();
			}
		};

		const handleDocumentMouseOver = (e) => {
			if (isModalOpen) return;

			const hoveredAnchor = e.target.closest?.("a");
			if (hoveredAnchor && hoveredAnchor.isContentEditable) {
				updatePopoverFromAnchor(hoveredAnchor);
			}
		};

		document.addEventListener("selectionchange", checkSelection);
		document.addEventListener("click", handleDocumentClick);
		document.addEventListener("mouseover", handleDocumentMouseOver);
		window.addEventListener("scroll", checkSelection, true);
		window.addEventListener("resize", checkSelection);

		return () => {
			document.removeEventListener("selectionchange", checkSelection);
			document.removeEventListener("click", handleDocumentClick);
			document.removeEventListener("mouseover", handleDocumentMouseOver);
			window.removeEventListener("scroll", checkSelection, true);
			window.removeEventListener("resize", checkSelection);
		};
	}, [isModalOpen, checkSelection, updatePopoverFromAnchor]);

	if (isModalOpen || !activeAnchor) return null;

	const href = activeAnchor.getAttribute("href") || "";

	const handleEdit = (e) => {
		e.preventDefault();
		e.stopPropagation();
		onEditLink?.(activeAnchor);
		setActiveAnchor(null);
	};

	const handleRemove = (e) => {
		e.preventDefault();
		e.stopPropagation();
		onRemoveLink?.(activeAnchor);
		setActiveAnchor(null);
	};

	return (
		<div
			ref={popoverRef}
			style={{
				position: "fixed",
				top: `${position.top}px`,
				left: `${position.left}px`,
				zIndex: 40,
			}}
			onMouseEnter={() => {
				isHoveringPopoverRef.current = true;
			}}
			onMouseLeave={() => {
				isHoveringPopoverRef.current = false;
			}}
			onMouseDown={(e) => {
				e.preventDefault();
				e.stopPropagation();
			}}
			className="bg-white border border-[#dadce0] rounded-lg shadow-md px-4 py-2 flex items-center gap-3 select-none animate-fadeIn"
		>
			{/* URL Clickable Preview */}
			<a
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				className="text-sm font-normal text-[#1a73e8] hover:underline hover:text-[#1558d6] max-w-[220px] md:max-w-[300px] truncate"
				title={href}
				onClick={(e) => e.stopPropagation()}
			>
				{href}
			</a>

			{/* Edit Button */}
			<button
				type="button"
				onMouseDown={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
				onClick={handleEdit}
				className="p-1.5 rounded-full text-[#5f6368] hover:text-[#202124] hover:bg-gray-100 transition cursor-pointer"
				title="Edit link"
			>
				<MdOutlineEdit className="text-lg" />
			</button>

			{/* Unlink Button */}
			<button
				type="button"
				onMouseDown={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
				onClick={handleRemove}
				className="p-1.5 rounded-full text-[#5f6368] hover:text-[#202124] hover:bg-gray-100 transition cursor-pointer"
				title="Remove link"
			>
				<MdOutlineLinkOff className="text-lg" />
			</button>
		</div>
	);
};

LinkPreviewPopover.propTypes = {
	onEditLink: PropTypes.func,
	onRemoveLink: PropTypes.func,
	isModalOpen: PropTypes.bool,
};

export default LinkPreviewPopover;
