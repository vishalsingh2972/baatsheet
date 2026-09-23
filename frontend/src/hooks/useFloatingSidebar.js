import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook to position and viewport-clamp a floating toolbar beside active form section
 * @param {Object} params
 * @param {number} params.activeSection - Currently active section index
 * @param {React.MutableRefObject} params.sectionRefs - Map of section index to DOM element ref
 * @param {React.RefObject} params.mainRef - Outer scrolling container ref
 * @param {React.RefObject} params.formContainerRef - Form content wrapper ref
 * @param {number} params.fieldsLength - Total dynamic fields count
 * @param {string} [params.headerImage] - Current header banner image URL
 * @param {number} [params.offsetRight=16] - Horizontal offset from right edge of form
 * @param {number} [params.minTop=120] - Top clamping bound (below header)
 * @param {number} [params.bottomOffset=25] - Bottom margin from screen edge
 * @param {number} [params.toolbarHeight=140] - Approximate height of the toolbar
 */
export const useFloatingSidebar = ({
	activeSection,
	sectionRefs,
	mainRef,
	formContainerRef,
	fieldsLength,
	headerImage = "",
	offsetRight = 16,
	minTop = 120,
	bottomOffset = 25,
	toolbarHeight = 180,
}) => {
	const [sidebarStyle, setSidebarStyle] = useState({
		top: minTop,
		left: 0,
		isReady: false,
	});

	const updatePosition = useCallback(() => {
		const activeRef = sectionRefs.current[activeSection];
		const formContainer = formContainerRef.current;
		if (!activeRef || !formContainer) return;

		const formRect = formContainer.getBoundingClientRect();
		const activeRect = activeRef.getBoundingClientRect();

		// Position toolbar to the right of the form container
		const left = formRect.right + offsetRight;

		// Desired top aligns with top of the active card (+2px breathing room)
		const desiredTop = activeRect.top + 2;

		// Viewport clamping limits: header clearance at top, 25px clearance at viewport bottom
		const maxTop = window.innerHeight - toolbarHeight - bottomOffset;
		const clampedTop = Math.max(minTop, Math.min(maxTop, desiredTop));

		setSidebarStyle({
			top: clampedTop,
			left,
			isReady: true,
		});
	}, [
		activeSection,
		sectionRefs,
		formContainerRef,
		offsetRight,
		minTop,
		bottomOffset,
		toolbarHeight,
	]);

	useEffect(() => {
		updatePosition();

		const mainEl = mainRef.current;
		const formContainer = formContainerRef.current;

		if (mainEl) {
			mainEl.addEventListener("scroll", updatePosition, {
				passive: true,
			});
		}
		window.addEventListener("resize", updatePosition);

		// Observe container size mutations (e.g. when banner image loads, items expand)
		let resizeObserver = null;
		if (formContainer && typeof ResizeObserver !== "undefined") {
			resizeObserver = new ResizeObserver(() => {
				updatePosition();
			});
			resizeObserver.observe(formContainer);
		}

		// Staggered timeouts to ensure position sync after image/font render
		const timeoutId1 = setTimeout(updatePosition, 50);
		const timeoutId2 = setTimeout(updatePosition, 200);

		return () => {
			if (mainEl) {
				mainEl.removeEventListener("scroll", updatePosition);
			}
			window.removeEventListener("resize", updatePosition);
			if (resizeObserver) {
				resizeObserver.disconnect();
			}
			clearTimeout(timeoutId1);
			clearTimeout(timeoutId2);
		};
	}, [
		updatePosition,
		fieldsLength,
		mainRef,
		formContainerRef,
		headerImage,
		activeSection,
	]);

	return { sidebarStyle, updatePosition };
};

export default useFloatingSidebar;
