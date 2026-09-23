import { useState } from "react";
import PropTypes from "prop-types";
import { LuEye } from "react-icons/lu";
import { GrRedo, GrUndo } from "react-icons/gr";
import { IoColorPaletteOutline } from "react-icons/io5";
import { MdOutlineAutoAwesome } from "react-icons/md";
import useAuth from "../../../hooks/useAuth";
import AuthPromptModal from "../../modals/AuthPromptModal";
import ShareFormModal from "../../modals/ShareFormModal";
import ImagePickerModal from "../../modals/ImagePickerModal";
import { useGetFormByIdQuery, useUpdateFormMutation } from "../../../redux/api/formApi";

const HeaderIcons = ({
	formId,
	formName = "Untitled form",
	headerImage = "",
	onHeaderImageChange,
	canUndo = false,
	canRedo = false,
	onUndo,
	onRedo,
}) => {
	const { isAuthenticated } = useAuth();
	const [showShareModal, setShowShareModal] = useState(false);
	const [showBannerModal, setShowBannerModal] = useState(false);
	const [modalConfig, setModalConfig] = useState({
		isOpen: false,
		title: "",
		message: "",
	});

	const { data: form } = useGetFormByIdQuery(formId, { skip: !formId });
	const [updateForm] = useUpdateFormMutation();

	const handleAction = (actionType) => {
		if (!isAuthenticated) {
			if (actionType === "share") {
				setModalConfig({
					isOpen: true,
					title: "Sign in to share",
					message: "You need to be signed in to generate a shareable link and collect responses.",
				});
			} else if (actionType === "preview") {
				setModalConfig({
					isOpen: true,
					title: "Sign in to preview",
					message: "Sign in to preview the live form.",
				});
			}
			return;
		}

		if (actionType === "preview") {
			if (formId) {
				window.open(`/forms/${formId}/preview`, "_blank", "noopener,noreferrer");
			}
		} else if (actionType === "share") {
			setShowShareModal(true);
		}
	};

	const handleSaveBanner = async (bannerUrl) => {
		onHeaderImageChange?.(bannerUrl);
		if (formId && isAuthenticated) {
			try {
				await updateForm({
					id: formId,
					headerImage: bannerUrl,
				}).unwrap();
			} catch (err) {
				console.error("Failed to update banner image:", err);
			}
		}
	};

	return (
		<>
			<div className="flex items-center">
				{/* Help me create / Gemini AI Icon */}
				<div
					onClick={() => window.dispatchEvent(new CustomEvent("open-ai-prompt-modal"))}
					className="p-2.5 rounded-full hover:bg-purple-50 cursor-pointer group transition"
					title="Help me create with AI (Gemini)"
				>
					<div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#8E24AA] via-[#673AB7] to-[#1E88E5] flex items-center justify-center shadow-2xs group-hover:scale-110 transition duration-200">
						<MdOutlineAutoAwesome className="text-white text-base" />
					</div>
				</div>

				{/* Customize Banner / Theme Icon */}
				<div
					onClick={() => setShowBannerModal(true)}
					className="p-3 rounded-full hover:bg-slate-100 cursor-pointer ml-0.5"
					title="Customize header banner"
				>
					<IoColorPaletteOutline fontSize="1.5em" color="#5f6368" />
				</div>

				{/* Preview Icon */}
				<div
					onClick={() => handleAction("preview")}
					className="p-3 rounded-full hover:bg-slate-100 cursor-pointer"
					title={isAuthenticated ? "Preview form" : "Sign in to preview form"}
				>
					<LuEye fontSize="1.5em" color="#5f6368" />
				</div>

				{/* Undo */}
				<button
					type="button"
					disabled={!canUndo}
					onClick={canUndo ? onUndo : undefined}
					className={`p-3 rounded-full mx-0.5 transition ${
						canUndo
							? "hover:bg-slate-100 cursor-pointer text-[#5f6368] hover:text-[#202124]"
							: "cursor-not-allowed text-[#9aa0a6]"
					}`}
					title={canUndo ? "Undo (Ctrl+Z)" : "Undo"}
				>
					<GrUndo fontSize="1.4em" />
				</button>

				{/* Redo */}
				<button
					type="button"
					disabled={!canRedo}
					onClick={canRedo ? onRedo : undefined}
					className={`p-3 rounded-full mx-0.5 transition ${
						canRedo
							? "hover:bg-slate-100 cursor-pointer text-[#5f6368] hover:text-[#202124]"
							: "cursor-not-allowed text-[#9aa0a6]"
					}`}
					title={canRedo ? "Redo (Ctrl+Y)" : "Redo"}
				>
					<GrRedo fontSize="1.4em" />
				</button>

				{/* Share Button */}
				<button
					type="button"
					onClick={() => handleAction("share")}
					className="py-1.5 px-5 rounded bg-[#673ab7] hover:bg-[#5a2ea6] mx-5 cursor-pointer text-white font-medium text-sm shadow-sm transition duration-150"
				>
					Share
				</button>
			</div>

			<ShareFormModal
				isOpen={showShareModal}
				onClose={() => setShowShareModal(false)}
				formId={formId}
				formTitle={formName}
			/>

			<ImagePickerModal
				isOpen={showBannerModal}
				onClose={() => setShowBannerModal(false)}
				currentImage={headerImage || form?.headerImage || ""}
				title="Add Header Banner"
				removeLabel="Remove banner"
				onSave={handleSaveBanner}
			/>

			<AuthPromptModal
				isOpen={modalConfig.isOpen}
				onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
				title={modalConfig.title}
				message={modalConfig.message}
			/>
		</>
	);
};

HeaderIcons.propTypes = {
	formId: PropTypes.string,
	formName: PropTypes.string,
	headerImage: PropTypes.string,
	onHeaderImageChange: PropTypes.func,
	canUndo: PropTypes.bool,
	canRedo: PropTypes.bool,
	onUndo: PropTypes.func,
	onRedo: PropTypes.func,
};

export default HeaderIcons;
