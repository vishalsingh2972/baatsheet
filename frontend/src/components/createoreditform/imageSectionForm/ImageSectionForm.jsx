import { useState, useRef, useEffect } from "react";
import { useWatch } from "react-hook-form";
import PropTypes from "prop-types";
import { MdOutlineImage } from "react-icons/md";
import FormCard from "../common/FormCard";
import TextFormattingIcons from "../TextFormattingIcons";
import RichTextEditor from "../../common/RichTextEditor";
import TtileDesFormIcons from "../TtileDesFormIcons";
import QuestionImageContainer from "../userEditForm/QuestionImageContainer";
import ImagePickerModal from "../../modals/ImagePickerModal";
import useClickOutside from "../../../hooks/useClickOutside";

const ImageSectionForm = ({
	activeElement,
	onDelete,
	onDuplicate,
	onPointerDownDrag,
	register,
	control,
	setValue,
	index,
}) => {
	const [titleFocused, setTitleFocused] = useState(false);
	const [hoverFocused, setHoverFocused] = useState(false);
	const [isImageModalOpen, setIsImageModalOpen] = useState(false);

	const titleWrapperRef = useRef(null);
	const titleInputRef = useRef(null);
	const titleToolbarRef = useRef(null);

	const hoverWrapperRef = useRef(null);
	const hoverInputRef = useRef(null);

	const watchedTitle = useWatch({
		control,
		name: `items.${index}.title`,
		defaultValue: "Image title",
	});

	const watchedImage = useWatch({
		control,
		name: `items.${index}.image`,
		defaultValue: "",
	});

	const watchedAlignment = useWatch({
		control,
		name: `items.${index}.imageAlignment`,
		defaultValue: "center",
	});

	const watchedHoverText = useWatch({
		control,
		name: `items.${index}.hoverText`,
		defaultValue: "",
	});

	const [showHoverText, setShowHoverText] = useState(Boolean(watchedHoverText));

	const { ref: registerHoverRef, ...hoverRest } = register ? register(`items.${index}.hoverText`) : { ref: () => {} };

	useEffect(() => {
		if (watchedHoverText && !showHoverText) {
			setShowHoverText(true);
		}
	}, [watchedHoverText, showHoverText]);

	useEffect(() => {
		if (!activeElement) {
			setTitleFocused(false);
			setHoverFocused(false);
		}
	}, [activeElement]);

	useClickOutside([titleWrapperRef, titleToolbarRef], () => setTitleFocused(false), activeElement && titleFocused);

	useClickOutside(hoverWrapperRef, () => setHoverFocused(false), activeElement && hoverFocused);

	// Automatically open image picker modal if newly inserted without an image
	useEffect(() => {
		if (activeElement && !watchedImage) {
			setIsImageModalOpen(true);
		}
	}, [activeElement, watchedImage]); // run once on mount

	const handleToggleHoverText = () => {
		if (showHoverText) {
			setShowHoverText(false);
			setValue?.(`items.${index}.hoverText`, "", { shouldDirty: true });
			setHoverFocused(false);
		} else {
			setShowHoverText(true);
			setHoverFocused(true);
			setTitleFocused(false);
			setTimeout(() => {
				hoverInputRef.current?.focus();
				hoverInputRef.current?.select();
			}, 50);
		}
	};

	return (
		<FormCard activeElement={activeElement} onPointerDownDrag={onPointerDownDrag}>
			{/* Image Title / Caption */}
			<div className="flex items-center gap-2">
				<div
					ref={titleWrapperRef}
					onClick={() => {
						setTitleFocused(true);
						setHoverFocused(false);
					}}
					className={`flex-grow ${
						activeElement
							? `bg-slate-100 ${
									titleFocused ? "border-[#4C2B87] border-b-[1.5px]" : "border-[#9ea0a4] border-b"
								}`
							: "bg-transparent border-transparent border-b"
					}`}
				>
					<RichTextEditor
						ref={titleInputRef}
						value={watchedTitle}
						onChange={(val) =>
							setValue?.(`items.${index}.title`, val, {
								shouldDirty: true,
							})
						}
						onFocus={() => {
							setTitleFocused(true);
							setHoverFocused(false);
						}}
						onClick={() => {
							setTitleFocused(true);
							setHoverFocused(false);
						}}
						placeholder="Image title"
						className={`w-full text-base bg-transparent ${
							activeElement
								? "py-3 pl-2 hover:bg-slate-200"
								: "py-0 pl-0 cursor-pointer font-normal text-[#202124]"
						}`}
						multiline={false}
					/>
				</div>

				{/* Copy, Delete, and 3-Dots Icons */}
				{activeElement && (
					<TtileDesFormIcons
						onDelete={onDelete}
						onDuplicate={onDuplicate}
						hasHoverTextOption={true}
						hasHoverText={showHoverText}
						onToggleHoverText={handleToggleHoverText}
					/>
				)}
			</div>

			{/* Text Formatting Toolbar for Image Title with Smooth Animation */}
			<TextFormattingIcons
				ref={titleToolbarRef}
				targetRef={titleInputRef}
				forDes={false}
				isVisible={activeElement && titleFocused}
				onFormat={(val) =>
					setValue?.(`items.${index}.title`, val, {
						shouldDirty: true,
					})
				}
			/>

			{/* Hover Text Input (toggled via 3-dots menu - positioned right under Image Title) */}
			{(showHoverText || (!activeElement && Boolean(watchedHoverText))) && (
				<div
					ref={hoverWrapperRef}
					onClick={() => {
						setHoverFocused(true);
						setTitleFocused(false);
					}}
					className={`w-full mt-2 ${
						activeElement
							? `bg-slate-100 ${
									hoverFocused ? "border-[#4C2B87] border-b-[1.5px]" : "border-[#9ea0a4] border-b"
								}`
							: "bg-transparent border-transparent border-b"
					}`}
				>
					<input
						{...hoverRest}
						ref={(el) => {
							registerHoverRef(el);
							hoverInputRef.current = el;
						}}
						onFocus={(e) => {
							setHoverFocused(true);
							setTitleFocused(false);
							e.target.select();
						}}
						onClick={() => {
							setHoverFocused(true);
							setTitleFocused(false);
						}}
						className={`w-full outline-none text-sm text-[#5f6368] bg-transparent ${
							activeElement ? "py-2.5 pl-2 hover:bg-slate-200" : "py-0 pl-0 cursor-pointer font-normal"
						}`}
						placeholder="Hover text"
					/>
				</div>
			)}

			{/* Image Display */}
			{watchedImage ? (
				<QuestionImageContainer
					image={watchedImage}
					alignment={watchedAlignment || "center"}
					onAlignmentChange={(newAlign) =>
						setValue?.(`items.${index}.imageAlignment`, newAlign, {
							shouldDirty: true,
						})
					}
					onChangeImage={() => setIsImageModalOpen(true)}
					onRemoveImage={() =>
						setValue?.(`items.${index}.image`, "", {
							shouldDirty: true,
						})
					}
					activeElement={activeElement}
				/>
			) : (
				/* Placeholder upload prompt if no image is selected yet */
				<div
					onClick={() => setIsImageModalOpen(true)}
					className="w-full my-4 py-8 border-2 border-dashed border-gray-300 hover:border-[#673ab7] rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50 hover:bg-purple-50/40 transition duration-150"
				>
					<div className="w-12 h-12 bg-purple-100 text-[#673ab7] rounded-full flex items-center justify-center text-2xl">
						<MdOutlineImage />
					</div>
					<p className="text-sm font-medium text-[#202124]">Click to add an image</p>
					<p className="text-xs text-gray-400">Upload from computer or paste an image URL</p>
				</div>
			)}

			{/* Image Picker Modal */}
			<ImagePickerModal
				isOpen={isImageModalOpen}
				onClose={() => setIsImageModalOpen(false)}
				currentImage={watchedImage}
				title="Add Image"
				removeLabel="Remove image"
				onSave={(url) =>
					setValue?.(`items.${index}.image`, url, {
						shouldDirty: true,
					})
				}
			/>
		</FormCard>
	);
};

ImageSectionForm.propTypes = {
	activeElement: PropTypes.bool,
	onDelete: PropTypes.func,
	onDuplicate: PropTypes.func,
	onPointerDownDrag: PropTypes.func,
	register: PropTypes.func,
	control: PropTypes.object,
	setValue: PropTypes.func,
	index: PropTypes.number,
};

export default ImageSectionForm;
