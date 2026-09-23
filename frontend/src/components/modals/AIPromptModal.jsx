import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useGenerateFormWithAIMutation } from "../../redux/api/formApi";
import AIModalHeader from "./aiPromptModal/AIModalHeader";
import AIPromptView from "./aiPromptModal/AIPromptView";
import AILoadingView from "./aiPromptModal/AILoadingView";
import AIPreviewView from "./aiPromptModal/AIPreviewView";
import AIModalFooter from "./aiPromptModal/AIModalFooter";

const AIPromptModal = ({ isOpen, onClose, onSuccess }) => {
	const [mode, setMode] = useState("prompt"); // 'prompt' | 'preview'
	const [prompt, setPrompt] = useState("");
	const [error, setError] = useState("");
	const [previewData, setPreviewData] = useState(null);
	const [generateFormWithAI, { isLoading }] = useGenerateFormWithAIMutation();

	useEffect(() => {
		if (isOpen) {
			setPrompt("");
			setError("");
			setMode("prompt");
			setPreviewData(null);
		}
	}, [isOpen]);

	if (!isOpen) return null;

	const handleClose = () => {
		setPrompt("");
		setError("");
		setMode("prompt");
		setPreviewData(null);
		onClose?.();
	};

	const handleGenerate = async (promptToUse = prompt) => {
		const cleanPrompt = (promptToUse || "").trim();
		if (!cleanPrompt) {
			setError("Please describe the form you want to create.");
			return;
		}

		setError("");
		try {
			const res = await generateFormWithAI({ prompt: cleanPrompt }).unwrap();
			const formData = res?.data || res;
			setPreviewData(formData);
			setMode("preview");
		} catch (err) {
			console.error("AI Form Generation failed:", err);
			setError(
				err?.data?.message ||
					"Failed to generate form. Please try a different prompt."
			);
		}
	};

	const handleChipClick = (suggestionPrompt) => {
		setPrompt(suggestionPrompt);
		handleGenerate(suggestionPrompt);
	};

	const handleAcceptForm = () => {
		if (!previewData) return;
		onSuccess?.(previewData);
		handleClose();
	};

	const handleTryAgain = () => {
		if (prompt && prompt.trim()) {
			handleGenerate(prompt.trim());
		} else {
			setMode("prompt");
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs px-4 animate-fade-in">
			{/* Exact Identical Dimensions Across All Stages */}
			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-[780px] h-[580px] overflow-hidden border border-[#E0E2EC] transition-all transform animate-scale-up flex flex-col justify-between">
				{/* 1. Header */}
				<AIModalHeader
					mode={mode}
					isLoading={isLoading}
					prompt={prompt}
					onPromptChange={setPrompt}
					onClose={handleClose}
					onBackToPrompt={() => setMode("prompt")}
					onTryAgain={handleTryAgain}
				/>

				{/* 2. Main Body */}
				{isLoading ? (
					<AILoadingView />
				) : mode === "prompt" ? (
					<AIPromptView
						prompt={prompt}
						setPrompt={setPrompt}
						error={error}
						setError={setError}
						onGenerate={() => handleGenerate()}
						onChipClick={handleChipClick}
					/>
				) : (
					<AIPreviewView previewData={previewData} />
				)}

				{/* 3. Footer */}
				<AIModalFooter
					mode={mode}
					isLoading={isLoading}
					previewData={previewData}
					onClose={handleClose}
					onGenerate={() => handleGenerate()}
					onAcceptForm={handleAcceptForm}
				/>
			</div>
		</div>
	);
};

AIPromptModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onSuccess: PropTypes.func,
};

export default AIPromptModal;
