import { useEffect, useRef } from "react";
import { useWatch } from "react-hook-form";

/**
 * Custom hook to watch form changes and trigger debounced auto-save ONLY when values actually change.
 * Flushes any pending save immediately on unmount to prevent data loss on fast navigation.
 * @param {Object} params
 * @param {Object} params.control - react-hook-form control object
 * @param {Function} params.onSave - Async or sync callback to save form data
 * @param {number} [params.delay=700] - Debounce delay in milliseconds
 * @param {boolean} [params.enabled=true] - Whether auto-save is currently enabled
 * @param {string|number} [params.resetKey] - Change this value to force baseline reset (e.g. after loading server data)
 * @param {Function} [params.onSavingStart] - Called when user starts typing / editing
 * @param {Function} [params.onSavingEnd] - Called when save completes (success: boolean)
 */
export const useAutoSave = ({
	control,
	onSave,
	delay = 700,
	enabled = true,
	resetKey,
	onSavingStart,
	onSavingEnd,
}) => {
	const timerRef = useRef(null);
	const prevSnapshotRef = useRef(null);
	const isInitializedRef = useRef(false);
	const pendingFormValuesRef = useRef(null);
	const hasPendingSaveRef = useRef(false);

	// Keep callbacks in refs so they never cause useEffect to re-run
	const onSaveRef = useRef(onSave);
	const onSavingStartRef = useRef(onSavingStart);
	const onSavingEndRef = useRef(onSavingEnd);

	useEffect(() => {
		onSaveRef.current = onSave;
		onSavingStartRef.current = onSavingStart;
		onSavingEndRef.current = onSavingEnd;
	});

	// When resetKey changes (i.e. server data was loaded), reset the baseline
	useEffect(() => {
		isInitializedRef.current = false;
		prevSnapshotRef.current = null;
		hasPendingSaveRef.current = false;
		pendingFormValuesRef.current = null;
		clearTimeout(timerRef.current);
	}, [resetKey]);

	// Flush pending save on unmount so fast navigation never loses changes
	useEffect(() => {
		return () => {
			if (hasPendingSaveRef.current && pendingFormValuesRef.current && onSaveRef.current) {
				try {
					onSaveRef.current(pendingFormValuesRef.current);
				} catch (e) {
					console.error("Flush on unmount error:", e);
				}
			}
			clearTimeout(timerRef.current);
		};
	}, []);

	const formValues = useWatch({ control });

	useEffect(() => {
		if (!enabled || !formValues) return;

		const currentSnapshot = JSON.stringify(formValues);

		// Record initial baseline on mount or after resetKey change — no save
		if (!isInitializedRef.current) {
			prevSnapshotRef.current = currentSnapshot;
			isInitializedRef.current = true;
			return;
		}

		// If form values haven't changed from baseline, skip
		if (prevSnapshotRef.current === currentSnapshot) {
			return;
		}

		// Update baseline snapshot & track pending save
		prevSnapshotRef.current = currentSnapshot;
		pendingFormValuesRef.current = formValues;
		hasPendingSaveRef.current = true;

		// Notify saving started
		if (onSavingStartRef.current) {
			onSavingStartRef.current();
		}

		clearTimeout(timerRef.current);
		timerRef.current = setTimeout(async () => {
			try {
				if (onSaveRef.current) {
					await onSaveRef.current(formValues);
				}
				hasPendingSaveRef.current = false;
				if (onSavingEndRef.current) {
					onSavingEndRef.current(true);
				}
			} catch (err) {
				console.error("Auto-save error:", err);
				if (onSavingEndRef.current) {
					onSavingEndRef.current(false, err);
				}
			}
		}, delay);

		return () => {
			clearTimeout(timerRef.current);
		};
	}, [formValues, delay, enabled]);
};

export default useAutoSave;
