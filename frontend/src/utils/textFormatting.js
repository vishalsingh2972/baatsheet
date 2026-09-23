/**
 * Utility to apply rich text formatting (bold, italic, underline, link, lists, clear)
 * directly in WYSIWYG ContentEditable elements using native document.execCommand.
 */

export const applyInlineFormat = (targetEl, formatType, payload = {}) => {
	if (!targetEl) return null;

	targetEl.focus();

	switch (formatType) {
		case "bold":
			document.execCommand("bold", false, null);
			break;

		case "italic":
			document.execCommand("italic", false, null);
			break;

		case "underline":
			document.execCommand("underline", false, null);
			break;

		case "link": {
			let linkUrl = payload.url || "";
			if (
				linkUrl &&
				!linkUrl.startsWith("http://") &&
				!linkUrl.startsWith("https://")
			) {
				linkUrl = `https://${linkUrl}`;
			}

			const selection = window.getSelection();
			if (!selection || selection.isCollapsed) {
				const linkHTML = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-[#673ab7] underline">${
					payload.text || linkUrl
				}</a>`;
				document.execCommand("insertHTML", false, linkHTML);
			} else {
				document.execCommand("createLink", false, linkUrl);
			}
			break;
		}

		case "clear":
			document.execCommand("removeFormat", false, null);
			break;

		case "numberedList":
			document.execCommand("insertOrderedList", false, null);
			break;

		case "bulletedList":
			document.execCommand("insertUnorderedList", false, null);
			break;

		default:
			return null;
	}

	// Trigger input event to update React Hook Form state
	const newHTML = targetEl.innerHTML;
	targetEl.dispatchEvent(new Event("input", { bubbles: true }));

	return newHTML;
};
