import { forwardRef } from "react";
import PropTypes from "prop-types";
import {
	MdOutlineInsertLink,
	MdFormatListBulleted,
	MdFormatListNumbered,
	MdOutlineFormatBold,
	MdOutlineFormatItalic,
	MdOutlineFormatUnderlined,
	MdFormatClear,
} from "react-icons/md";
import { applyInlineFormat } from "../../utils/textFormatting";
import InsertLinkModal from "../modals/InsertLinkModal";
import LinkPreviewPopover from "../common/LinkPreviewPopover";
import FormatButton from "./textFormatting/FormatButton";
import useTextFormattingState from "./textFormatting/useTextFormattingState";
import useLinkFormatting from "./textFormatting/useLinkFormatting";

const TextFormattingIcons = forwardRef(
	({ targetRef, onFormat, forDes = false, isVisible = true }, ref) => {
		const { activeStates, checkActiveStates } = useTextFormattingState();

		const {
			isLinkModalOpen,
			selectedText,
			initialUrl,
			openLinkModal,
			closeLinkModal,
			editExistingLink,
			removeExistingLink,
			handleLinkApply,
		} = useLinkFormatting({ targetRef, onFormat, checkActiveStates });

		const handleApply = (formatType, payload = {}) => {
			const el = targetRef?.current;
			if (!el) return;

			if (formatType === "link") {
				handleLinkApply(payload, (element, type, data) => {
					const updatedText = applyInlineFormat(element, type, data);
					if (updatedText !== null) onFormat?.(updatedText);
					checkActiveStates();
				});
				return;
			}

			const updatedText = applyInlineFormat(el, formatType, payload);
			if (updatedText !== null) {
				onFormat?.(updatedText);
			}
			checkActiveStates();
		};

		return (
			<>
				<div
					ref={ref}
					className={`grid transition-all duration-200 ease-out overflow-hidden ${
						isVisible
							? "grid-rows-[1fr] opacity-100 translate-y-0 mt-2 pointer-events-auto"
							: "grid-rows-[0fr] opacity-0 -translate-y-1.5 mt-0 pointer-events-none"
					}`}
				>
					<div
						className="min-h-0 flex gap-1 items-center select-none py-0.5"
						onMouseDown={(e) => e.preventDefault()}
					>
						{/* Bold */}
						<FormatButton
							icon={MdOutlineFormatBold}
							title="Bold"
							isActive={activeStates.bold}
							onClick={() => handleApply("bold")}
						/>

						{/* Italic */}
						<FormatButton
							icon={MdOutlineFormatItalic}
							title="Italic"
							isActive={activeStates.italic}
							onClick={() => handleApply("italic")}
						/>

						{/* Underline */}
						<FormatButton
							icon={MdOutlineFormatUnderlined}
							title="Underline"
							isActive={activeStates.underline}
							onClick={() => handleApply("underline")}
						/>

						{/* Insert / Remove Link Toggle */}
						<FormatButton
							icon={MdOutlineInsertLink}
							title={activeStates.link ? "Remove link" : "Insert link"}
							isActive={activeStates.link}
							onClick={() => openLinkModal(activeStates.link)}
						/>

						{/* Lists for Description fields */}
						{forDes && (
							<>
								<FormatButton
									icon={MdFormatListNumbered}
									title="Numbered list"
									isActive={activeStates.orderedList}
									onClick={() => handleApply("numberedList")}
								/>

								<FormatButton
									icon={MdFormatListBulleted}
									title="Bulleted list"
									isActive={activeStates.unorderedList}
									onClick={() => handleApply("bulletedList")}
								/>
							</>
						)}

						{/* Clear Formatting */}
						<FormatButton
							icon={MdFormatClear}
							title="Remove formatting"
							onClick={() => handleApply("clear")}
						/>
					</div>
				</div>

				{/* Floating Link Tooltip Popover (Edit & Unlink) */}
				<LinkPreviewPopover
					onEditLink={editExistingLink}
					onRemoveLink={removeExistingLink}
					isModalOpen={isLinkModalOpen}
				/>

				{/* Link Insert / Edit Modal */}
				<InsertLinkModal
					isOpen={isLinkModalOpen}
					onClose={closeLinkModal}
					initialText={selectedText}
					initialUrl={initialUrl}
					onSave={(linkData) => handleApply("link", linkData)}
				/>
			</>
		);
	}
);

TextFormattingIcons.displayName = "TextFormattingIcons";

TextFormattingIcons.propTypes = {
	targetRef: PropTypes.object,
	onFormat: PropTypes.func,
	forDes: PropTypes.bool,
	isVisible: PropTypes.bool,
};

export default TextFormattingIcons;
