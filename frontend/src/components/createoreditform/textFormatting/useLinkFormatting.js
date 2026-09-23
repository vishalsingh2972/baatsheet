import { useState, useCallback } from "react";

export const useLinkFormatting = ({ targetRef, onFormat, checkActiveStates }) => {
	const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
	const [selectedText, setSelectedText] = useState("");
	const [initialUrl, setInitialUrl] = useState("");
	const [savedRange, setSavedRange] = useState(null);
	const [editingAnchor, setEditingAnchor] = useState(null);

	const closeLinkModal = useCallback(() => {
		setIsLinkModalOpen(false);
		setEditingAnchor(null);
	}, []);

	const editExistingLink = useCallback((anchor) => {
		setEditingAnchor(anchor);
		setSelectedText(anchor.innerText || "");
		setInitialUrl(anchor.getAttribute("href") || "");
		setIsLinkModalOpen(true);
	}, []);

	const removeExistingLink = useCallback((anchor) => {
		const el = targetRef?.current;
		if (!anchor || !el) return;

		// Replace anchor with its plain text contents
		const textNode = document.createTextNode(anchor.innerText);
		anchor.parentNode?.replaceChild(textNode, anchor);

		const updatedHTML = el.innerHTML;
		el.dispatchEvent(new Event("input", { bubbles: true }));
		onFormat?.(updatedHTML);
		checkActiveStates?.();
	}, [targetRef, onFormat, checkActiveStates]);

	const openLinkModal = useCallback((isLinkActive) => {
		const sel = window.getSelection();
		const anchor =
			sel?.anchorNode?.nodeType === Node.ELEMENT_NODE
				? sel.anchorNode.closest("a")
				: sel?.anchorNode?.parentElement?.closest("a");

		// If currently inside a link, clicking link icon toggles it OFF (removes the link)
		if (isLinkActive || (anchor && anchor.isContentEditable)) {
			if (anchor) {
				removeExistingLink(anchor);
				return;
			}
			document.execCommand("unlink", false, null);
			const el = targetRef?.current;
			if (el) {
				const updatedHTML = el.innerHTML;
				el.dispatchEvent(new Event("input", { bubbles: true }));
				onFormat?.(updatedHTML);
			}
			checkActiveStates?.();
			return;
		}

		if (sel && sel.rangeCount > 0) {
			const range = sel.getRangeAt(0);
			setSavedRange(range.cloneRange());
			setSelectedText(sel.toString());
		} else {
			setSavedRange(null);
			setSelectedText("");
		}
		setInitialUrl("");
		setEditingAnchor(null);
		setIsLinkModalOpen(true);
	}, [targetRef, onFormat, checkActiveStates, removeExistingLink]);

	const handleLinkApply = useCallback((payload, defaultApply) => {
		const el = targetRef?.current;
		if (!el) return;

		// If updating an existing link
		if (editingAnchor) {
			editingAnchor.setAttribute("href", payload.url);
			editingAnchor.innerText = payload.text || payload.url;
			setEditingAnchor(null);
			const updatedHTML = el.innerHTML;
			el.dispatchEvent(new Event("input", { bubbles: true }));
			onFormat?.(updatedHTML);
			checkActiveStates?.();
			return;
		}

		// If inserting a new link with saved selection range
		if (savedRange) {
			const sel = window.getSelection();
			sel?.removeAllRanges();
			sel?.addRange(savedRange);
		}

		defaultApply?.(el, "link", payload);
	}, [targetRef, editingAnchor, savedRange, onFormat, checkActiveStates]);

	return {
		isLinkModalOpen,
		selectedText,
		initialUrl,
		openLinkModal,
		closeLinkModal,
		editExistingLink,
		removeExistingLink,
		handleLinkApply,
	};
};

export default useLinkFormatting;
