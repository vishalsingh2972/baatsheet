import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
	useGenerateQuestionWithAIMutation,
	useEditQuestionWithAIMutation,
} from "../../redux/api/formApi";
import AIQuestionHeader from "./aiQuestionModal/AIQuestionHeader";
import AIQuestionPromptView from "./aiQuestionModal/AIQuestionPromptView";
import AIQuestionLoadingView from "./aiQuestionModal/AIQuestionLoadingView";
import AIQuestionPreviewView from "./aiQuestionModal/AIQuestionPreviewView";
import AIQuestionFooter from "./aiQuestionModal/AIQuestionFooter";

const AIQuestionModal = ({
	isOpen,
	onClose,
	onInsertQuestions,
	onUpdateQuestion,
	onUpdateHeader,
	activeContext,
	formTitle = "",
}) => {
	const [mode, setMode] = useState("add"); // 'add' | 'edit'
	const [prompt, setPrompt] = useState("");
	const [error, setError] = useState("");
	const [isStagePreview, setIsStagePreview] = useState(false);
	const [previewQuestions, setPreviewQuestions] = useState([]);
	const [previewHeader, setPreviewHeader] = useState(null);

	const [generateQuestionWithAI, { isLoading: isGenerating }] =
		useGenerateQuestionWithAIMutation();
	const [editQuestionWithAI, { isLoading: isEditing }] =
		useEditQuestionWithAIMutation();

	const isLoading = isGenerating || isEditing;

	const isHeader = activeContext?.isHeader === true;
	const isQuestion = activeContext?.type === "question";
	const activeTargetTitle =
		activeContext?.title ||
		activeContext?.questionTitle ||
		"Untitled";

	useEffect(() => {
		if (isOpen) {
			setPrompt("");
			setError("");
			setIsStagePreview(false);
			setPreviewQuestions([]);
			setPreviewHeader(null);
			setMode("add");
		}
	}, [isOpen]);

	if (!isOpen) return null;

	const handleClose = () => {
		if (!isLoading) {
			setPrompt("");
			setError("");
			setIsStagePreview(false);
			setPreviewQuestions([]);
			setPreviewHeader(null);
			onClose?.();
		}
	};

	const handleGenerateOrEdit = async (promptToUse = prompt) => {
		const cleanPrompt = (promptToUse || "").trim();
		if (!cleanPrompt) {
			setError("Please enter a description or instruction.");
			return;
		}

		setError("");

		try {
			if (mode === "edit") {
				// Edit Section Mode
				const res = await editQuestionWithAI({
					instruction: cleanPrompt,
					currentQuestion: activeContext || {},
					formTitle: formTitle || activeContext?.title || "Untitled form",
				}).unwrap();

				if (isHeader) {
					const updatedHeader = res?.data?.header || res?.header;
					if (updatedHeader) {
						setPreviewHeader(updatedHeader);
						setIsStagePreview(true);
					}
				} else {
					const updatedQuestion = res?.data?.question || res?.question;
					if (updatedQuestion) {
						setPreviewQuestions([updatedQuestion]);
						setIsStagePreview(true);
					}
				}
			} else {
				// Add Questions Mode
				const res = await generateQuestionWithAI({
					prompt: cleanPrompt,
					context: formTitle,
				}).unwrap();

				const rawQuestions =
					res?.data?.questions ||
					res?.questions ||
					(res?.data?.question ? [res.data.question] : []) ||
					(res?.question ? [res.question] : []);

				if (Array.isArray(rawQuestions) && rawQuestions.length > 0) {
					setPreviewQuestions(rawQuestions);
					setIsStagePreview(true);
				} else {
					setError("No questions generated. Please try a different prompt.");
				}
			}
		} catch (err) {
			console.error("AI Generation failed:", err);
			setError(
				err?.data?.message ||
					"Failed to generate preview with AI. Please try again."
			);
		}
	};

	const handleRemoveQuestionFromPreview = (removeIdx) => {
		setPreviewQuestions((prev) => prev.filter((_, i) => i !== removeIdx));
	};

	const handleAccept = async () => {
		if (mode === "edit") {
			if (isHeader && previewHeader) {
				await onUpdateHeader?.(previewHeader);
			} else if (previewQuestions.length > 0) {
				await onUpdateQuestion?.(previewQuestions[0]);
			}
		} else if (previewQuestions.length > 0) {
			await onInsertQuestions?.(previewQuestions);
		}
		handleClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
			{/* Exact Identical Dimensions Across All Stages */}
			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-[620px] h-[540px] overflow-hidden border border-[#E0E2EC] transition-all transform animate-scale-up flex flex-col justify-between">
				{/* 1. Header */}
				<AIQuestionHeader
					isStagePreview={isStagePreview}
					isLoading={isLoading}
					mode={mode}
					isHeader={isHeader}
					prompt={prompt}
					onPromptChange={setPrompt}
					onClose={handleClose}
					onBackToPrompt={() => setIsStagePreview(false)}
					onTryAgain={() => handleGenerateOrEdit(prompt)}
				/>

				{/* 2. Main Body */}
				{isLoading ? (
					<AIQuestionLoadingView mode={mode} isHeader={isHeader} />
				) : isStagePreview ? (
					<AIQuestionPreviewView
						mode={mode}
						isHeader={isHeader}
						previewQuestions={previewQuestions}
						previewHeader={previewHeader}
						onRemoveQuestion={handleRemoveQuestionFromPreview}
					/>
				) : (
					<AIQuestionPromptView
						mode={mode}
						setMode={(newMode) => {
							setMode(newMode);
							setError("");
						}}
						isHeader={isHeader}
						isQuestion={isQuestion}
						activeTargetTitle={activeTargetTitle}
						prompt={prompt}
						setPrompt={setPrompt}
						error={error}
						setError={setError}
						onGenerate={() => handleGenerateOrEdit(prompt)}
					/>
				)}

				{/* 3. Footer */}
				{!isLoading && (
					<AIQuestionFooter
						isStagePreview={isStagePreview}
						isLoading={isLoading}
						mode={mode}
						isHeader={isHeader}
						prompt={prompt}
						previewQuestionsCount={previewQuestions.length}
						onClose={handleClose}
						onGenerate={() => handleGenerateOrEdit(prompt)}
						onAccept={handleAccept}
					/>
				)}
			</div>
		</div>
	);
};

AIQuestionModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onInsertQuestions: PropTypes.func,
	onUpdateQuestion: PropTypes.func,
	onUpdateHeader: PropTypes.func,
	activeContext: PropTypes.shape({
		isHeader: PropTypes.bool,
		type: PropTypes.string,
		title: PropTypes.string,
		questionTitle: PropTypes.string,
		description: PropTypes.string,
		questionType: PropTypes.string,
		options: PropTypes.array,
	}),
	formTitle: PropTypes.string,
};

export default AIQuestionModal;
