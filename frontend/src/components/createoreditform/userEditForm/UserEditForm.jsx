import { useState, useEffect, useRef } from "react";
import { useWatch } from "react-hook-form";
import { MdOutlineImage } from "react-icons/md";
import PropTypes from "prop-types";
import FormCard from "../common/FormCard";
import TextFormattingIcons from "../TextFormattingIcons";
import RichTextEditor from "../../common/RichTextEditor";
import OptionBasedDetails from "./selectOption/OptionBasedDetails";
import BottomIconsContainer from "../BottomIconsContainer";
import SelectOption from "./selectOption/SelectOption";
import QuestionImageContainer from "./QuestionImageContainer";
import ImagePickerModal from "../../modals/ImagePickerModal";
import useClickOutside from "../../../hooks/useClickOutside";

const UserEditForm = ({
	activeElement,
	onDelete,
	onDuplicate,
	onPointerDownDrag,
	register,
	control,
	setValue,
	index,
	questionType = "multiplechoice",
}) => {
	const watchedQuestionTitle = useWatch({
		control,
		name: `items.${index}.questionTitle`,
		defaultValue: "Untitled Question",
	});

	const watchedQuestionType = useWatch({
		control,
		name: `items.${index}.questionType`,
		defaultValue: questionType || "multiplechoice",
	});

	const watchedDescription = useWatch({
		control,
		name: `items.${index}.description`,
		defaultValue: "",
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

	const selectOption = watchedQuestionType || questionType || "multiplechoice";
	const [selected, setSelected] = useState(null); // 0 = Title, 1 = Description
	const [isImageModalOpen, setIsImageModalOpen] = useState(false);
	const [showDescription, setShowDescription] = useState(
		Boolean(watchedDescription)
	);

	const titleWrapperRef = useRef(null);
	const titleInputRef = useRef(null);
	const titleToolbarRef = useRef(null);

	const descWrapperRef = useRef(null);
	const descInputRef = useRef(null);
	const descToolbarRef = useRef(null);

	useEffect(() => {
		if (watchedDescription && !showDescription) {
			setShowDescription(true);
		}
	}, [watchedDescription, showDescription]);

	useEffect(() => {
		if (!activeElement) {
			setSelected(null);
		}
	}, [activeElement]);

	useClickOutside(
		[titleWrapperRef, titleToolbarRef, descWrapperRef, descToolbarRef],
		() => setSelected(null),
		activeElement && selected !== null
	);

	const handleOptionTypeChange = (newType) => {
		if (setValue) {
			setValue(`items.${index}.questionType`, newType, {
				shouldDirty: true,
			});
		}
	};

	const handleToggleDescription = () => {
		if (showDescription) {
			setShowDescription(false);
			setValue?.(`items.${index}.description`, "", { shouldDirty: true });
			if (selected === 1) setSelected(null);
		} else {
			setShowDescription(true);
			setSelected(1);
			setTimeout(() => {
				descInputRef.current?.focus();
			}, 50);
		}
	};

	return (
		<FormCard
			activeElement={activeElement}
			onPointerDownDrag={onPointerDownDrag}
		>
			<div className="flex items-start md:items-center gap-2">
				<div
					ref={titleWrapperRef}
					onClick={() => setSelected(0)}
					className={`flex-1 min-w-0 ${
						activeElement
							? `bg-slate-100 ${
									selected === 0
										? "border-[#4C2B87] border-b-[1.5px]"
										: "border-[#9ea0a4] border-b"
							  }`
							: "bg-transparent border-transparent border-b"
					}`}
				>
					<RichTextEditor
						ref={titleInputRef}
						value={watchedQuestionTitle}
						onChange={(val) =>
							setValue?.(`items.${index}.questionTitle`, val, {
								shouldDirty: true,
							})
						}
						onFocus={() => setSelected(0)}
						onClick={() => setSelected(0)}
						placeholder="Question"
						className={`w-full text-base bg-transparent ${
							activeElement
								? "py-3 pl-2 hover:bg-slate-200"
								: "py-0 pl-0 cursor-pointer font-normal text-[#202124]"
						}`}
						multiline={false}
					/>
				</div>

				{/* image icon button */}
				{activeElement && (
					<div
						onClick={() => setIsImageModalOpen(true)}
						className="p-2.5 rounded-full hover:bg-slate-100 cursor-pointer shrink-0"
						title="Add image to question"
					>
						<MdOutlineImage fontSize="1.5em" color="#5f6368" />
					</div>
				)}

				{/* type selector */}
				{activeElement && (
					<SelectOption
						selectOption={selectOption}
						setSelectOption={handleOptionTypeChange}
					/>
				)}
			</div>

			<TextFormattingIcons
				ref={titleToolbarRef}
				targetRef={titleInputRef}
				isVisible={activeElement && selected === 0}
				onFormat={(val) =>
					setValue?.(`items.${index}.questionTitle`, val, {
						shouldDirty: true,
					})
				}
			/>

			{/* Question Description (toggled via 3-dots menu) */}
			{(showDescription || (!activeElement && Boolean(watchedDescription))) && (
				<>
					<div
						ref={descWrapperRef}
						onClick={() => setSelected(1)}
						className={`w-full mt-2 ${
							activeElement
								? `bg-slate-100 ${
										selected === 1
											? "border-[#4C2B87] border-b-[1.5px]"
											: "border-[#9ea0a4] border-b"
								  }`
								: "bg-transparent border-transparent border-b"
						}`}
					>
						<RichTextEditor
							ref={descInputRef}
							value={watchedDescription}
							onChange={(val) =>
								setValue?.(`items.${index}.description`, val, {
									shouldDirty: true,
								})
							}
							onFocus={() => setSelected(1)}
							onClick={() => setSelected(1)}
							placeholder="Description"
							className={`w-full text-sm text-[#5f6368] bg-transparent ${
								activeElement
									? "py-2.5 pl-2 hover:bg-slate-200"
									: "py-0 pl-0 cursor-pointer font-normal"
							}`}
							multiline={true}
						/>
					</div>

					<TextFormattingIcons
						ref={descToolbarRef}
						targetRef={descInputRef}
						forDes={true}
						isVisible={activeElement && selected === 1}
						onFormat={(val) =>
							setValue?.(`items.${index}.description`, val, {
								shouldDirty: true,
							})
						}
					/>
				</>
			)}

			{/* Question Attached Image */}
			{watchedImage && (
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
			)}

			{/* options list */}
			<OptionBasedDetails
				selectOption={selectOption}
				activeElement={activeElement}
				control={control}
				register={register}
				setValue={setValue}
				index={index}
				onOptionFocus={() => setSelected(null)}
			/>

			{/* bottom hr and toolbar only when active */}
			{activeElement && (
				<>
					<hr className="border-[0.5] border-[#DADCE0] mt-8 mb-2" />
					<BottomIconsContainer
						onDelete={onDelete}
						onDuplicate={onDuplicate}
						register={register}
						index={index}
						hasDescription={showDescription}
						onToggleDescription={handleToggleDescription}
					/>
				</>
			)}

			{/* Insert/Change Question Image Modal */}
			<ImagePickerModal
				isOpen={isImageModalOpen}
				onClose={() => setIsImageModalOpen(false)}
				currentImage={watchedImage}
				title="Add Question Image"
				removeLabel="Remove question image"
				onSave={(url) =>
					setValue?.(`items.${index}.image`, url, {
						shouldDirty: true,
					})
				}
			/>
		</FormCard>
	);
};

UserEditForm.propTypes = {
	activeElement: PropTypes.bool,
	onDelete: PropTypes.func,
	onDuplicate: PropTypes.func,
	onPointerDownDrag: PropTypes.func,
	register: PropTypes.func,
	control: PropTypes.object,
	setValue: PropTypes.func,
	index: PropTypes.number,
	questionType: PropTypes.string,
};

export default UserEditForm;
