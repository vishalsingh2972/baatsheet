import { useEffect, useRef, useCallback } from "react";

export const useFormUndoRedo = ({
	history,
	watchedFormData,
	getValues,
	reset,
	setAutoSaveResetKey,
	onNameChange,
	onHeaderImageChange,
	onHistoryChange,
	onRegisterUndoRedo,
}) => {
	const historyTimerRef = useRef(null);

	// Sync history flags to parent header
	useEffect(() => {
		onHistoryChange?.({
			canUndo: history.canUndo,
			canRedo: history.canRedo,
		});
	}, [history.canUndo, history.canRedo, onHistoryChange]);

	// Record debounced history snapshot on user typing / edits
	useEffect(() => {
		if (!watchedFormData || !watchedFormData.items) return;
		if (history.isApplyingHistory()) return;

		if (historyTimerRef.current) {
			clearTimeout(historyTimerRef.current);
		}

		historyTimerRef.current = setTimeout(() => {
			history.record(watchedFormData);
		}, 400);

		return () => {
			if (historyTimerRef.current) {
				clearTimeout(historyTimerRef.current);
			}
		};
	}, [watchedFormData, history]);

	// Execute Undo with live-state checking
	const executeUndo = useCallback(() => {
		if (historyTimerRef.current) {
			clearTimeout(historyTimerRef.current);
		}
		const currentValues = getValues();
		const prev = history.undo(currentValues);
		if (prev) {
			reset(prev);
			setAutoSaveResetKey((k) => k + 1);
			if (prev.name && onNameChange) {
				onNameChange(prev.name);
			}
			if (prev.headerImage !== undefined && onHeaderImageChange) {
				onHeaderImageChange(prev.headerImage);
			}
		}
	}, [history, reset, getValues, onNameChange, onHeaderImageChange, setAutoSaveResetKey]);

	// Execute Redo with live-state checking
	const executeRedo = useCallback(() => {
		if (historyTimerRef.current) {
			clearTimeout(historyTimerRef.current);
		}
		const currentValues = getValues();
		const next = history.redo(currentValues);
		if (next) {
			reset(next);
			setAutoSaveResetKey((k) => k + 1);
			if (next.name && onNameChange) {
				onNameChange(next.name);
			}
			if (next.headerImage !== undefined && onHeaderImageChange) {
				onHeaderImageChange(next.headerImage);
			}
		}
	}, [history, reset, getValues, onNameChange, onHeaderImageChange, setAutoSaveResetKey]);

	// Register Undo / Redo callers with parent page
	useEffect(() => {
		onRegisterUndoRedo?.(executeUndo, executeRedo);
	}, [onRegisterUndoRedo, executeUndo, executeRedo]);

	// Keyboard shortcut listener for Undo (Cmd+Z / Ctrl+Z) and Redo (Cmd+Shift+Z / Cmd+Y / Ctrl+Y)
	useEffect(() => {
		const handleKeyDown = (e) => {
			const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
			const isModifier = isMac ? e.metaKey : e.ctrlKey;

			if (!isModifier) return;

			// Redo: Cmd+Shift+Z, Cmd+Y, or Ctrl+Y
			if (
				(e.shiftKey && (e.key === "z" || e.key === "Z")) ||
				e.key === "y" ||
				e.key === "Y"
			) {
				if (history.canRedo) {
					e.preventDefault();
					executeRedo();
				}
			}
			// Undo: Cmd+Z or Ctrl+Z
			else if (e.key === "z" || e.key === "Z") {
				if (history.canUndo) {
					e.preventDefault();
					executeUndo();
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [history.canUndo, history.canRedo, executeUndo, executeRedo]);

	return {
		executeUndo,
		executeRedo,
	};
};

export default useFormUndoRedo;
