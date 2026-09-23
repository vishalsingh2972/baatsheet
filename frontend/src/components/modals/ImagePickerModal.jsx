import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useGenerateImageWithAIMutation } from "../../redux/api/formApi";
import { AI_BANNER_IDEAS, AI_QUESTION_IDEAS } from "./imagePickerModal/imagePickerData";
import ImagePickerHeader from "./imagePickerModal/ImagePickerHeader";
import ImagePickerTabs from "./imagePickerModal/ImagePickerTabs";
import ImageUploadView from "./imagePickerModal/ImageUploadView";
import ImageAIPromptView from "./imagePickerModal/ImageAIPromptView";
import ImageAILoadingView from "./imagePickerModal/ImageAILoadingView";
import ImageAIPreviewView from "./imagePickerModal/ImageAIPreviewView";
import ImagePickerFooter from "./imagePickerModal/ImagePickerFooter";

const ImagePickerModal = ({
	isOpen,
	onClose,
	currentImage = "",
	onSave,
	title = "Insert Image",
	removeLabel = "Remove image",
	aspectRatio,
}) => {
	const isHeader =
		title.toLowerCase().includes("header") ||
		title.toLowerCase().includes("banner") ||
		aspectRatio === "16:9";

	const effectiveRatio = aspectRatio || (isHeader ? "16:9" : "4:3");

	const [tab, setTab] = useState("upload"); // 'upload' | 'ai'
	const [imageUrl, setImageUrl] = useState("");
	const [previewUrl, setPreviewUrl] = useState("");
	const [error, setError] = useState("");
	const [isProcessing, setIsProcessing] = useState(false);

	// AI Generation State
	const [aiPrompt, setAiPrompt] = useState("");
	const [selectedStyle, setSelectedStyle] = useState("");
	const [isAiPreviewStage, setIsAiPreviewStage] = useState(false);

	const [generateImageWithAI, { isLoading: isGeneratingAI }] =
		useGenerateImageWithAIMutation();

	useEffect(() => {
		if (isOpen) {
			setImageUrl(currentImage || "");
			setPreviewUrl(currentImage || "");
			setError("");
			setIsProcessing(false);
			setAiPrompt("");
			setSelectedStyle("");
			setIsAiPreviewStage(false);
			setTab("upload");
		}
	}, [isOpen, currentImage]);

	// Escape key to close
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape") onClose();
		};
		if (isOpen) {
			window.addEventListener("keydown", handleKeyDown);
		}
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const handleUrlChange = (val) => {
		setImageUrl(val);
		setPreviewUrl(val);
		setError("");
	};

	const handleFileUpload = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!file.type.startsWith("image/")) {
			setError("Please upload a valid image file.");
			return;
		}

		setIsProcessing(true);
		setError("");

		const reader = new FileReader();
		reader.onload = (event) => {
			const rawDataUrl = event.target?.result;
			if (typeof rawDataUrl !== "string") {
				setIsProcessing(false);
				return;
			}

			// Compress image using HTML5 Canvas
			const img = new Image();
			img.onload = () => {
				const maxWidth = 1400;
				let width = img.width;
				let height = img.height;

				if (width > maxWidth) {
					height = Math.round((height * maxWidth) / width);
					width = maxWidth;
				}

				const canvas = document.createElement("canvas");
				canvas.width = width;
				canvas.height = height;
				const ctx = canvas.getContext("2d");
				ctx.drawImage(img, 0, 0, width, height);

				const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
				setImageUrl(compressedDataUrl);
				setPreviewUrl(compressedDataUrl);
				setIsProcessing(false);
			};
			img.onerror = () => {
				setError("Failed to process image file.");
				setIsProcessing(false);
			};
			img.src = rawDataUrl;
		};
		reader.readAsDataURL(file);
	};

	const handleGenerateAI = async (promptToUse = aiPrompt) => {
		const cleanPrompt = (promptToUse || "").trim();
		if (!cleanPrompt) {
			setError("Please enter a description for the image.");
			return;
		}

		setError("");
		try {
			const res = await generateImageWithAI({
				prompt: cleanPrompt,
				aspectRatio: effectiveRatio,
				style: selectedStyle || undefined,
			}).unwrap();

			const generatedUrl = res?.data?.imageUrl || res?.imageUrl;
			if (generatedUrl) {
				setPreviewUrl(generatedUrl);
				setImageUrl(generatedUrl);
				setIsAiPreviewStage(true);
			} else {
				setError("Failed to generate image. Please try another prompt.");
			}
		} catch (err) {
			console.error("AI Image Generation failed:", err);
			setError(
				err?.data?.message ||
					"Failed to generate image with AI. Please try again."
			);
		}
	};

	const handleDone = () => {
		if (!previewUrl.trim()) {
			setError("Please provide, upload, or generate an image first.");
			return;
		}
		onSave(previewUrl.trim());
		onClose();
	};

	const ideas = isHeader ? AI_BANNER_IDEAS : AI_QUESTION_IDEAS;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in"
			onClick={onClose}
		>
			<div
				className="bg-white w-full max-w-[620px] h-[600px] rounded-2xl shadow-2xl overflow-hidden flex flex-col justify-between border border-[#DADCE0] transition-all transform animate-scale-up"
				onClick={(e) => e.stopPropagation()}
			>
				{/* 1. Modal Header */}
				<ImagePickerHeader
					isAiPreviewStage={tab === "ai" && isAiPreviewStage}
					isGeneratingAI={isGeneratingAI}
					title={title}
					isHeader={isHeader}
					aiPrompt={aiPrompt}
					onPromptChange={setAiPrompt}
					onTryAgain={() => handleGenerateAI()}
					onBackToPrompt={() => setIsAiPreviewStage(false)}
					onClose={onClose}
				/>

				{/* 2. Segmented Mode Selector */}
				{!(tab === "ai" && isAiPreviewStage) && (
					<ImagePickerTabs
						tab={tab}
						onTabChange={(newTab) => {
							setTab(newTab);
							setError("");
						}}
					/>
				)}

				{/* 3. Modal Body */}
				<div className="flex-1 p-6 overflow-y-auto flex flex-col justify-between">
					{isGeneratingAI ? (
						<ImageAILoadingView />
					) : tab === "ai" && isAiPreviewStage ? (
						<ImageAIPreviewView
							previewUrl={previewUrl}
							isHeader={isHeader}
							onImageError={() =>
								setError(
									"Unable to load generated image. Please click Try Again."
								)
							}
						/>
					) : tab === "upload" ? (
						<ImageUploadView
							imageUrl={imageUrl}
							previewUrl={previewUrl}
							isProcessing={isProcessing}
							onUrlChange={handleUrlChange}
							onFileUpload={handleFileUpload}
							onImageError={() =>
								setError(
									"Unable to load image from URL. Please check the link."
								)
							}
						/>
					) : (
						<ImageAIPromptView
							aiPrompt={aiPrompt}
							isHeader={isHeader}
							selectedStyle={selectedStyle}
							ideas={ideas}
							isGeneratingAI={isGeneratingAI}
							onPromptChange={(val) => {
								setAiPrompt(val);
								if (error) setError("");
							}}
							onStyleSelect={(styleVal) =>
								setSelectedStyle((prev) =>
									prev === styleVal ? "" : styleVal
								)
							}
							onIdeaClick={(ideaText) => {
								setAiPrompt(ideaText);
								if (error) setError("");
							}}
							onGenerateAI={handleGenerateAI}
						/>
					)}

					{/* Error Alert */}
					{error && (
						<p className="text-xs text-red-500 font-medium mt-2">{error}</p>
					)}
				</div>

				{/* 4. Modal Footer */}
				<ImagePickerFooter
					currentImage={currentImage}
					removeLabel={removeLabel}
					isProcessing={isProcessing}
					isGeneratingAI={isGeneratingAI}
					previewUrl={previewUrl}
					isAiPreviewStage={isAiPreviewStage}
					tab={tab}
					onRemove={() => {
						onSave("");
						onClose();
					}}
					onClose={onClose}
					onDone={handleDone}
				/>
			</div>
		</div>
	);
};

ImagePickerModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	currentImage: PropTypes.string,
	onSave: PropTypes.func.isRequired,
	title: PropTypes.string,
	removeLabel: PropTypes.string,
	aspectRatio: PropTypes.string,
};

export default ImagePickerModal;
