import { useState, useRef, useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import FormSectionList from "./sections/FormSectionList";
import RightSideIconBar from "./RightSideIconBar";
import FormEditorModals from "./FormEditorModals";
import useFloatingSidebar from "../../hooks/useFloatingSidebar";
import useAutoSave from "../../hooks/useAutoSave";
import useAuth from "../../hooks/useAuth";
import useFormHistory from "../../hooks/useFormHistory";
import useFormUndoRedo from "./hooks/useFormUndoRedo";
import useFormInitialization from "./hooks/useFormInitialization";
import useFormFieldActions from "./hooks/useFormFieldActions";
import {
	useGetFormByIdQuery,
	useCreateFormMutation,
	useUpdateFormMutation,
} from "../../redux/api/formApi";

const CreateOrEditForm = ({
	formId: propFormId,
	headerImage: propHeaderImage = "",
	onHeaderImageChange,
	onNameChange,
	onSaveStatusChange,
	onHistoryChange,
	onRegisterUndoRedo,
}) => {
	const { id: paramId } = useParams();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const formId = propFormId || paramId || searchParams.get("id");
	const { isAuthenticated } = useAuth();

	const [activeSection, setActiveSection] = useState(0);
	const [autoSaveResetKey, setAutoSaveResetKey] = useState(0);
	const [isAIPromptModalOpen, setIsAIPromptModalOpen] = useState(
		searchParams.get("ai") === "true"
	);
	const [isAIQuestionModalOpen, setIsAIQuestionModalOpen] = useState(false);
	const [showAuthModal, setShowAuthModal] = useState(false);

	const sectionRefs = useRef({});
	const mainRef = useRef(null);
	const formContainerRef = useRef(null);

	const history = useFormHistory();

	// AI Prompt Modal open triggers
	useEffect(() => {
		if (searchParams.get("ai") === "true") {
			setIsAIPromptModalOpen(true);
		}
	}, [searchParams]);

	useEffect(() => {
		const handleOpenModal = () => setIsAIPromptModalOpen(true);
		window.addEventListener("open-ai-prompt-modal", handleOpenModal);
		return () =>
			window.removeEventListener("open-ai-prompt-modal", handleOpenModal);
	}, []);

	// RTK Query API endpoints
	const { data: existingForm, isLoading: isFetching } = useGetFormByIdQuery(
		formId,
		{ skip: !formId }
	);
	const [createForm] = useCreateFormMutation();
	const [updateForm] = useUpdateFormMutation();

	// Form State Management
	const { control, register, reset, setValue, getValues } = useForm({
		defaultValues: {
			name: "Untitled form",
			title: "Untitled form",
			description: "Form description",
			headerImage: propHeaderImage || "",
			items: [
				{
					type: "question",
					questionTitle: "Untitled Question",
					questionType: "multiplechoice",
					options: ["Option 1"],
				},
			],
		},
	});

	const { fields, insert, remove, move } = useFieldArray({
		control,
		name: "items",
	});

	const watchedHeaderImage = useWatch({
		control,
		name: "headerImage",
		defaultValue: propHeaderImage || "",
	});

	const watchedFormData = useWatch({ control });

	// Sync external propHeaderImage if provided
	useEffect(() => {
		if (propHeaderImage !== undefined) {
			setValue("headerImage", propHeaderImage, { shouldDirty: false });
		}
	}, [propHeaderImage, setValue]);

	// 1. Hook: Undo / Redo history and keyboard shortcuts
	useFormUndoRedo({
		history,
		watchedFormData,
		getValues,
		reset,
		setAutoSaveResetKey,
		onNameChange,
		onHeaderImageChange,
		onHistoryChange,
		onRegisterUndoRedo,
	});

	// 2. Hook: Form Initialization & Guest Draft Migration
	const { isCreatingFormRef } = useFormInitialization({
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
	});

	// 3. Hook: Field CRUD Actions (Add, Insert, Duplicate, Move, Delete)
	const {
		activeContext,
		handleAddQuestion,
		handleInsertAIQuestions,
		handleUpdateAIQuestion,
		handleUpdateAIHeader,
		handleAddTitle,
		handleAddImage,
		handleDuplicateField,
		handleDeleteField,
		handleMoveField,
	} = useFormFieldActions({
		activeSection,
		setActiveSection,
		fields,
		insert,
		remove,
		move,
		setValue,
		getValues,
	});

	// Canvas Debounced Auto-Save
	useAutoSave({
		control,
		delay: 700,
		enabled: true,
		resetKey: autoSaveResetKey,
		onSavingStart: () => onSaveStatusChange?.("saving"),
		onSavingEnd: (success) => {
			if (!isAuthenticated) {
				onSaveStatusChange?.("draft");
			} else {
				onSaveStatusChange?.(success ? "saved" : "error");
			}
		},
		onSave: async (formData) => {
			if (isAuthenticated) {
				if (formId) {
					await updateForm({ id: formId, ...formData }).unwrap();
				} else if (!isCreatingFormRef.current) {
					isCreatingFormRef.current = true;
					try {
						const res = await createForm(formData).unwrap();
						const newId = res?._id || res?.data?._id;
						localStorage.removeItem("google_form_draft");
						if (newId) {
							navigate(`/forms/${newId}/edit`, { replace: true });
						}
					} catch (err) {
						isCreatingFormRef.current = false;
						throw err;
					}
				}
			} else {
				try {
					localStorage.setItem(
						"google_form_draft",
						JSON.stringify(formData)
					);
				} catch (e) {
					console.error("Local draft save error:", e);
				}
			}
		},
	});

	const effectiveHeaderImage =
		propHeaderImage !== null && propHeaderImage !== undefined
			? propHeaderImage
			: (watchedHeaderImage ?? existingForm?.headerImage ?? "");

	// Smart floating sidebar positioning hook
	const { sidebarStyle } = useFloatingSidebar({
		activeSection,
		sectionRefs,
		mainRef,
		formContainerRef,
		fieldsLength: fields.length,
		headerImage: effectiveHeaderImage,
	});

	const handleHeaderImageChange = async (newUrl) => {
		setValue("headerImage", newUrl, { shouldDirty: true });
		onHeaderImageChange?.(newUrl);
		if (formId && isAuthenticated) {
			try {
				await updateForm({ id: formId, headerImage: newUrl }).unwrap();
			} catch (err) {
				console.error("Failed to update banner image:", err);
			}
		}
	};

	useEffect(() => {
		if (activeSection > fields.length) {
			setActiveSection(fields.length);
		}
	}, [fields.length, activeSection]);

	if (formId && isFetching) {
		return (
			<div className="w-full h-full flex items-center justify-center pt-28">
				<div className="w-10 h-10 border-4 border-[#673ab7] border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	const handleAISuccess = async (generatedData) => {
		if (!generatedData) return;
		const formName = generatedData.name || "Untitled form";
		const formTitle = generatedData.title || "Untitled form";
		const formDescription = generatedData.description || "";
		const formItems = generatedData.items || [];
		const formHeaderImage = generatedData.headerImage || "";

		setIsAIPromptModalOpen(false);

		const formPayload = {
			name: formName,
			title: formTitle,
			description: formDescription,
			headerImage: formHeaderImage,
			items: formItems,
		};

		if (formId && isAuthenticated) {
			setValue("name", formName, { shouldDirty: true });
			setValue("title", formTitle, { shouldDirty: true });
			setValue("description", formDescription, { shouldDirty: true });
			setValue("items", formItems, { shouldDirty: true });
			if (formHeaderImage) {
				setValue("headerImage", formHeaderImage, { shouldDirty: true });
			}
			onNameChange?.(formName);
			onSaveStatusChange?.("saving");
			try {
				await updateForm({ id: formId, ...formPayload }).unwrap();
				setAutoSaveResetKey((k) => k + 1);
				onSaveStatusChange?.("saved");
			} catch (err) {
				console.error("Failed to update form with AI:", err);
				onSaveStatusChange?.("error");
			}
		} else if (isAuthenticated) {
			onSaveStatusChange?.("saving");
			try {
				const res = await createForm(formPayload).unwrap();
				const newId = res?._id || res?.data?._id;
				localStorage.removeItem("google_form_draft");
				onSaveStatusChange?.("saved");
				if (newId) {
					navigate(`/forms/${newId}/edit`, { replace: true });
				}
			} catch (err) {
				console.error("Failed to create form with AI:", err);
				onSaveStatusChange?.("error");
			}
		} else {
			setValue("name", formName, { shouldDirty: true });
			setValue("title", formTitle, { shouldDirty: true });
			setValue("description", formDescription, { shouldDirty: true });
			setValue("items", formItems, { shouldDirty: true });
			if (formHeaderImage) {
				setValue("headerImage", formHeaderImage, { shouldDirty: true });
			}
			onNameChange?.(formName);
			localStorage.setItem("google_form_draft", JSON.stringify(formPayload));
			setAutoSaveResetKey((k) => k + 1);
			onSaveStatusChange?.("draft");
			if (searchParams.get("ai")) {
				navigate(window.location.pathname, { replace: true });
			}
		}
	};

	const handleCloseAIPromptModal = () => {
		setIsAIPromptModalOpen(false);
		if (searchParams.get("ai")) {
			navigate(window.location.pathname, { replace: true });
		}
	};

	return (
		<main
			ref={mainRef}
			className="w-full h-full flex flex-col items-center pt-28 pb-24 overflow-y-scroll scroll-smooth relative"
		>
			<div ref={formContainerRef} className="w-[780px] relative">
				{sidebarStyle.isReady && (
					<div
						style={{
							position: "fixed",
							top: `${sidebarStyle.top}px`,
							left: `${sidebarStyle.left}px`,
							transition: "top 0.2s ease-out, left 0.15s ease-out",
							zIndex: 10,
						}}
					>
						<RightSideIconBar
							onAddQuestion={handleAddQuestion}
							onAddAIQuestion={() => setIsAIQuestionModalOpen(true)}
							onAddTitle={handleAddTitle}
							onAddImage={handleAddImage}
						/>
					</div>
				)}

				<FormSectionList
					activeSection={activeSection}
					onSectionClick={setActiveSection}
					sectionRefs={sectionRefs}
					register={register}
					control={control}
					setValue={setValue}
					fields={fields}
					headerImage={effectiveHeaderImage}
					onHeaderImageChange={handleHeaderImageChange}
					onDeleteField={handleDeleteField}
					onDuplicateField={handleDuplicateField}
					onMoveField={handleMoveField}
				/>
			</div>

			{/* Editor Modals Container */}
			<FormEditorModals
				showAuthModal={showAuthModal}
				onCloseAuthModal={() => setShowAuthModal(false)}
				isAIPromptModalOpen={isAIPromptModalOpen}
				onCloseAIPromptModal={handleCloseAIPromptModal}
				onAISuccess={handleAISuccess}
				isAIQuestionModalOpen={isAIQuestionModalOpen}
				onCloseAIQuestionModal={() => setIsAIQuestionModalOpen(false)}
				onInsertAIQuestions={handleInsertAIQuestions}
				onUpdateAIQuestion={handleUpdateAIQuestion}
				onUpdateHeader={handleUpdateAIHeader}
				activeContext={activeContext}
				formTitle={getValues("title") || ""}
			/>
		</main>
	);
};

CreateOrEditForm.propTypes = {
	formId: PropTypes.string,
	headerImage: PropTypes.string,
	onHeaderImageChange: PropTypes.func,
	onNameChange: PropTypes.func,
	onSaveStatusChange: PropTypes.func,
	onHistoryChange: PropTypes.func,
	onRegisterUndoRedo: PropTypes.func,
};

export default CreateOrEditForm;
