import { useState, useRef, useEffect, useCallback } from "react";

/**
 * Custom hook to handle card drag-and-drop reordering with requestAnimationFrame
 * and layout pre-measurement to prevent layout jitter.
 */
export const useCardDragReorder = ({
	fields,
	sectionRefs,
	onMoveField,
	onSectionClick,
}) => {
	const [dragCardState, setDragCardState] = useState({
		isDragging: false,
		dragIdx: null,
		dragY: 0,
		targetIdx: null,
		draggedHeight: 0,
	});

	const dragCardStateRef = useRef(dragCardState);
	dragCardStateRef.current = dragCardState;

	const startYRef = useRef(0);
	const cardLayoutsRef = useRef([]);
	const rafIdRef = useRef(null);
	const latestPointerYRef = useRef(0);

	const handlePointerDownCardDrag = useCallback(
		(e, fieldIdx) => {
			e.preventDefault();
			e.stopPropagation();

			startYRef.current = e.clientY;
			latestPointerYRef.current = e.clientY;
			const draggedEl = sectionRefs.current[fieldIdx + 1];
			const cardHeight = draggedEl ? draggedEl.offsetHeight : 160;

			// Pre-measure static card layouts ONCE at dragstart to avoid transform feedback loops
			const initialLayouts = fields.map((_, idx) => {
				const el = sectionRefs.current[idx + 1];
				if (!el) return { top: 0, bottom: 0, height: 160, center: 0 };
				const rect = el.getBoundingClientRect();
				return {
					top: rect.top,
					bottom: rect.bottom,
					height: rect.height,
					center: rect.top + rect.height / 2,
				};
			});

			cardLayoutsRef.current = initialLayouts;

			setDragCardState({
				isDragging: true,
				dragIdx: fieldIdx,
				dragY: 0,
				targetIdx: fieldIdx,
				draggedHeight: cardHeight,
			});

			const grabOffset = draggedEl
				? e.clientY - draggedEl.getBoundingClientRect().top
				: 10;

			const updateDragFrame = () => {
				const currentY = latestPointerYRef.current;
				const deltaY = currentY - startYRef.current;
				const layouts = cardLayoutsRef.current;

				const draggedCardTop = currentY - grabOffset;
				const draggedCardBottom = draggedCardTop + cardHeight;

				let newTarget = fieldIdx;

				if (layouts && layouts.length > 0) {
					// Moving downward
					for (let i = fieldIdx + 1; i < layouts.length; i++) {
						if (layouts[i] && draggedCardBottom > layouts[i].bottom - 10) {
							newTarget = i;
						}
					}
					// Moving upward
					for (let i = fieldIdx - 1; i >= 0; i--) {
						if (layouts[i] && draggedCardTop < layouts[i].top + 10) {
							newTarget = i;
						}
					}
				}

				setDragCardState((prev) => ({
					...prev,
					dragY: deltaY,
					targetIdx: newTarget,
				}));

				rafIdRef.current = null;
			};

			const handlePointerMove = (moveEvent) => {
				latestPointerYRef.current = moveEvent.clientY;
				if (!rafIdRef.current) {
					rafIdRef.current = requestAnimationFrame(updateDragFrame);
				}
			};

			const handlePointerUp = () => {
				if (rafIdRef.current) {
					cancelAnimationFrame(rafIdRef.current);
					rafIdRef.current = null;
				}
				window.removeEventListener("pointermove", handlePointerMove);
				window.removeEventListener("pointerup", handlePointerUp);

				const current = dragCardStateRef.current;
				if (
					current.isDragging &&
					current.targetIdx !== null &&
					current.dragIdx !== null
				) {
					if (current.targetIdx !== current.dragIdx) {
						onMoveField?.(current.dragIdx, current.targetIdx);
					} else {
						onSectionClick?.(current.dragIdx + 1);
					}
				}

				setDragCardState({
					isDragging: false,
					dragIdx: null,
					dragY: 0,
					targetIdx: null,
					draggedHeight: 0,
				});
				cardLayoutsRef.current = [];
			};

			window.addEventListener("pointermove", handlePointerMove, {
				passive: true,
			});
			window.addEventListener("pointerup", handlePointerUp);
		},
		[fields, sectionRefs, onMoveField, onSectionClick]
	);

	useEffect(() => {
		return () => {
			if (rafIdRef.current) {
				cancelAnimationFrame(rafIdRef.current);
			}
			setDragCardState({
				isDragging: false,
				dragIdx: null,
				dragY: 0,
				targetIdx: null,
				draggedHeight: 0,
			});
		};
	}, []);

	const getCardStyle = useCallback(
		(index) => {
			const isCurrentDragged =
				dragCardState.isDragging && dragCardState.dragIdx === index;

			if (isCurrentDragged) {
				return {
					transform: `translate3d(0, ${dragCardState.dragY}px, 0)`,
					zIndex: 50,
					transition: "none",
					willChange: "transform",
				};
			}

			if (dragCardState.isDragging) {
				const { dragIdx, targetIdx, draggedHeight } = dragCardState;
				const offset = (draggedHeight || 160) + 12;

				if (dragIdx < targetIdx && index > dragIdx && index <= targetIdx) {
					return {
						transform: `translate3d(0, -${offset}px, 0)`,
						transition: "transform 220ms cubic-bezier(0.2, 1, 0.3, 1)",
						willChange: "transform",
					};
				}

				if (dragIdx > targetIdx && index < dragIdx && index >= targetIdx) {
					return {
						transform: `translate3d(0, ${offset}px, 0)`,
						transition: "transform 220ms cubic-bezier(0.2, 1, 0.3, 1)",
						willChange: "transform",
					};
				}

				return {
					transform: "translate3d(0, 0px, 0)",
					transition: "transform 220ms cubic-bezier(0.2, 1, 0.3, 1)",
					willChange: "transform",
				};
			}

			return {};
		},
		[dragCardState]
	);

	return {
		dragCardState,
		handlePointerDownCardDrag,
		getCardStyle,
	};
};

export default useCardDragReorder;
