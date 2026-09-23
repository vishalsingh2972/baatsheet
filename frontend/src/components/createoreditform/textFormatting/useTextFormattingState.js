import { useState, useEffect, useCallback } from "react";

export const useTextFormattingState = () => {
	const [activeStates, setActiveStates] = useState({
		bold: false,
		italic: false,
		underline: false,
		link: false,
		orderedList: false,
		unorderedList: false,
	});

	const checkActiveStates = useCallback(() => {
		try {
			const sel = window.getSelection();
			const isInsideLink = Boolean(
				sel?.anchorNode?.nodeType === Node.ELEMENT_NODE
					? sel.anchorNode.closest("a")
					: sel?.anchorNode?.parentElement?.closest("a")
			);

			setActiveStates({
				bold: document.queryCommandState("bold"),
				italic: document.queryCommandState("italic"),
				underline: document.queryCommandState("underline"),
				link: isInsideLink,
				orderedList: document.queryCommandState("insertOrderedList"),
				unorderedList: document.queryCommandState("insertUnorderedList"),
			});
		} catch {
			// queryCommandState edge cases
		}
	}, []);

	useEffect(() => {
		checkActiveStates();
		document.addEventListener("selectionchange", checkActiveStates);
		return () => {
			document.removeEventListener("selectionchange", checkActiveStates);
		};
	}, [checkActiveStates]);

	return {
		activeStates,
		checkActiveStates,
	};
};

export default useTextFormattingState;
