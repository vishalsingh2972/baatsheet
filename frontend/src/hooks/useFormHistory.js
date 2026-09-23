import { useState, useCallback, useRef } from "react";

const MAX_HISTORY_LIMIT = 50;

export const useFormHistory = () => {
	const [canUndo, setCanUndo] = useState(false);
	const [canRedo, setCanRedo] = useState(false);

	const pastRef = useRef([]);
	const presentRef = useRef(null);
	const futureRef = useRef([]);
	const isApplyingHistoryRef = useRef(false);

	const syncFlags = useCallback(() => {
		setCanUndo(pastRef.current.length > 0);
		setCanRedo(futureRef.current.length > 0);
	}, []);

	// Initialize or reset baseline state without creating an undo step
	const setInitial = useCallback(
		(state) => {
			if (!state) return;
			const snapshot = JSON.stringify(state);
			pastRef.current = [];
			presentRef.current = snapshot;
			futureRef.current = [];
			syncFlags();
		},
		[syncFlags]
	);

	// Record a new state snapshot
	const record = useCallback(
		(state) => {
			if (!state || isApplyingHistoryRef.current) return;
			const snapshot = JSON.stringify(state);

			if (presentRef.current === null) {
				presentRef.current = snapshot;
				return;
			}

			// Don't duplicate identical snapshots
			if (presentRef.current === snapshot) return;

			pastRef.current.push(presentRef.current);
			if (pastRef.current.length > MAX_HISTORY_LIMIT) {
				pastRef.current.shift();
			}
			presentRef.current = snapshot;
			futureRef.current = [];
			syncFlags();
		},
		[syncFlags]
	);

	// Perform Undo with live state validation
	const undo = useCallback(
		(currentState) => {
			if (pastRef.current.length === 0) return null;

			const currentStr = currentState
				? JSON.stringify(currentState)
				: presentRef.current;
			let previous = pastRef.current.pop();

			// Skip any identical snapshot that matches the current form state
			while (
				previous &&
				previous === currentStr &&
				pastRef.current.length > 0
			) {
				previous = pastRef.current.pop();
			}

			if (!previous || previous === currentStr) {
				syncFlags();
				return null;
			}

			if (currentStr) {
				futureRef.current.unshift(currentStr);
			}
			presentRef.current = previous;
			syncFlags();

			try {
				isApplyingHistoryRef.current = true;
				return JSON.parse(previous);
			} catch (e) {
				console.error("Failed to parse undo snapshot:", e);
				return null;
			} finally {
				setTimeout(() => {
					isApplyingHistoryRef.current = false;
				}, 150);
			}
		},
		[syncFlags]
	);

	// Perform Redo with live state validation
	const redo = useCallback(
		(currentState) => {
			if (futureRef.current.length === 0) return null;

			const currentStr = currentState
				? JSON.stringify(currentState)
				: presentRef.current;
			let next = futureRef.current.shift();

			// Skip any identical snapshot that matches the current form state
			while (
				next &&
				next === currentStr &&
				futureRef.current.length > 0
			) {
				next = futureRef.current.shift();
			}

			if (!next || next === currentStr) {
				syncFlags();
				return null;
			}

			if (currentStr) {
				pastRef.current.push(currentStr);
			}
			presentRef.current = next;
			syncFlags();

			try {
				isApplyingHistoryRef.current = true;
				return JSON.parse(next);
			} catch (e) {
				console.error("Failed to parse redo snapshot:", e);
				return null;
			} finally {
				setTimeout(() => {
					isApplyingHistoryRef.current = false;
				}, 150);
			}
		},
		[syncFlags]
	);

	return {
		canUndo,
		canRedo,
		setInitial,
		record,
		undo,
		redo,
		isApplyingHistory: () => isApplyingHistoryRef.current,
	};
};

export default useFormHistory;
