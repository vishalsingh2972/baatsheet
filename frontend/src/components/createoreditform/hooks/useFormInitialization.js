import { useEffect, useRef } from "react";

export const useFormInitialization = ({
	formId,
	existingForm,
	reset,
	history,
	setAutoSaveResetKey,
	onNameChange,
	onHeaderImageChange,
	onSaveStatusChange,
	isAuthenticated,
	createForm,
	navigate,
}) => {
	const loadedFormIdRef = useRef(null);
	const isCreatingFormRef = useRef(false);

	useEffect(() => {
		const currentFormKey = existingForm?._id || formId;

		if (existingForm && loadedFormIdRef.current !== currentFormKey) {
			loadedFormIdRef.current = currentFormKey;
			const initialData = {
				name: existingForm.name || "Untitled form",
				title: existingForm.title || "Untitled form",
				description: existingForm.description || "",
				headerImage: existingForm.headerImage || "",
				items:
					existingForm.items && existingForm.items.length > 0
						? existingForm.items.map((item) => ({
								...item,
								options:
									item.options && item.options.length > 0
										? item.options
										: ["Option 1"],
							}))
						: [
								{
									type: "question",
									questionTitle: "Untitled Question",
									questionType: "multiplechoice",
									options: ["Option 1"],
								},
							],
			};

			reset(initialData);
			history.setInitial(initialData);

			if (onNameChange) {
				onNameChange(
					existingForm.name || existingForm.title || "Untitled form"
				);
			}
			if (onHeaderImageChange && existingForm.headerImage) {
				onHeaderImageChange(existingForm.headerImage);
			}
			setAutoSaveResetKey((k) => k + 1);
			onSaveStatusChange?.("saved");
		} else if (!formId && !loadedFormIdRef.current) {
			loadedFormIdRef.current = "guest_draft";
			try {
				const localDraft = localStorage.getItem("google_form_draft");
				if (localDraft) {
					const parsed = JSON.parse(localDraft);
					if (parsed && typeof parsed === "object") {
						reset(parsed);
						history.setInitial(parsed);
						if (parsed.name && onNameChange) {
							onNameChange(parsed.name);
						}
						if (parsed.headerImage && onHeaderImageChange) {
							onHeaderImageChange(parsed.headerImage);
						}
						setAutoSaveResetKey((k) => k + 1);

						// If the user is now authenticated, auto-save the guest draft immediately to MongoDB ONCE
						if (isAuthenticated && !isCreatingFormRef.current) {
							isCreatingFormRef.current = true;
							onSaveStatusChange?.("saving");
							createForm(parsed)
								.unwrap()
								.then((res) => {
									const newId = res?._id || res?.data?._id;
									localStorage.removeItem("google_form_draft");
									onSaveStatusChange?.("saved");
									if (newId) {
										navigate(`/forms/${newId}/edit`, {
											replace: true,
										});
									}
								})
								.catch((err) => {
									console.error("Draft migration save error:", err);
									onSaveStatusChange?.("error");
								})
								.finally(() => {
									isCreatingFormRef.current = false;
								});
						} else {
							onSaveStatusChange?.("draft");
						}
					}
				}
			} catch (e) {
				console.error("Failed to load local draft:", e);
			}
		}
	}, [
		existingForm,
		formId,
		reset,
		isAuthenticated,
		onSaveStatusChange,
		onNameChange,
		onHeaderImageChange,
		createForm,
		navigate,
		history,
		setAutoSaveResetKey,
	]);

	return {
		isCreatingFormRef,
	};
};

export default useFormInitialization;
