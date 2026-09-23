import { useEffect } from "react";

/**
 * Custom hook to detect clicks outside specified ref element(s)
 * @param {React.RefObject | React.RefObject[]} refs - Single ref or array of refs to watch
 * @param {Function} callback - Function to call when clicked outside
 * @param {boolean} [enabled=true] - Whether the listener is active
 */
export const useClickOutside = (refs, callback, enabled = true) => {
	useEffect(() => {
		if (!enabled) return;

		const handleDocumentClick = (e) => {
			// Do not trigger click outside if interacting with any modal backdrop, dialog, or popover
			if (
				e.target.closest?.(".fixed") ||
				e.target.closest?.("[role='dialog']")
			) {
				return;
			}

			const refList = Array.isArray(refs) ? refs : [refs];
			const isInside = refList.some(
				(ref) => ref.current && ref.current.contains(e.target)
			);

			if (!isInside) {
				callback(e);
			}
		};

		document.addEventListener("mousedown", handleDocumentClick);
		return () => {
			document.removeEventListener("mousedown", handleDocumentClick);
		};
	}, [refs, callback, enabled]);
};

export default useClickOutside;
