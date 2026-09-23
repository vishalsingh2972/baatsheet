import { useState, useEffect, useRef } from "react";
import { useWatch } from "react-hook-form";
import PropTypes from "prop-types";
import FormCard from "../common/FormCard";
import TextFormattingIcons from "../TextFormattingIcons";
import RichTextEditor from "../../common/RichTextEditor";
import TtileDesFormIcons from "../TtileDesFormIcons";
import useClickOutside from "../../../hooks/useClickOutside";

const TitleAndDesForm = ({
	activeElement,
	onDelete,
	onDuplicate,
	onPointerDownDrag,
	control,
	setValue,
	index,
}) => {
	const [selected, setSelected] = useState(null);
	const titleWrapperRef = useRef(null);
	const titleInputRef = useRef(null);
	const titleToolbarRef = useRef(null);

	const descWrapperRef = useRef(null);
	const descInputRef = useRef(null);
	const descToolbarRef = useRef(null);

	const watchedTitle = useWatch({
		control,
		name: `items.${index}.questionTitle`,
		defaultValue: "Untitled title",
	});

	const watchedDescription = useWatch({
		control,
		name: `items.${index}.description`,
		defaultValue: "Description",
	});

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

	return (
		<FormCard
			activeElement={activeElement}
			onPointerDownDrag={onPointerDownDrag}
		>
			<div className="flex items-center gap-2">
				<div
					ref={titleWrapperRef}
					onClick={() => setSelected(0)}
					className={`flex-grow ${
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
						value={watchedTitle}
						onChange={(val) =>
							setValue?.(`items.${index}.questionTitle`, val, {
								shouldDirty: true,
							})
						}
						onFocus={() => setSelected(0)}
						onClick={() => setSelected(0)}
						placeholder="Untitled title"
						className={`w-full text-base bg-transparent ${
							activeElement
								? "py-3 pl-2 hover:bg-slate-200"
								: "py-0 pl-0 cursor-pointer font-normal text-[#202124]"
						}`}
						multiline={false}
					/>
				</div>

				{/* copy, delete and three dot icons */}
				{activeElement && (
					<TtileDesFormIcons
						onDelete={onDelete}
						onDuplicate={onDuplicate}
					/>
				)}
			</div>

			<TextFormattingIcons
				ref={titleToolbarRef}
				targetRef={titleInputRef}
				forDes={false}
				isVisible={activeElement && selected === 0}
				onFormat={(val) =>
					setValue?.(`items.${index}.questionTitle`, val, {
						shouldDirty: true,
					})
				}
			/>

			<div
				ref={descWrapperRef}
				onClick={() => setSelected(1)}
				className={`w-full mt-2 ${
					activeElement
						? selected === 1
							? "border-[#4C2B87] border-b-[1.5px]"
							: "border-[#DADCE0] border-b"
						: "border-transparent border-b"
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
					className={`outline-none text-sm text-[#5f6368] w-full bg-transparent ${
						activeElement ? "pt-3 pl-2" : "pt-1 pl-0 cursor-pointer"
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
		</FormCard>
	);
};

TitleAndDesForm.propTypes = {
	activeElement: PropTypes.bool,
	onDelete: PropTypes.func,
	onDuplicate: PropTypes.func,
	onPointerDownDrag: PropTypes.func,
	control: PropTypes.object,
	setValue: PropTypes.func,
	index: PropTypes.number,
};

export default TitleAndDesForm;
