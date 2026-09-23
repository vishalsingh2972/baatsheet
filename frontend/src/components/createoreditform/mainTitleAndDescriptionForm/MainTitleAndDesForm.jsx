import { useState, useEffect, useRef } from "react";
import { useWatch } from "react-hook-form";
import PropTypes from "prop-types";
import FormCard from "../common/FormCard";
import TextFormattingIcons from "../TextFormattingIcons";
import RichTextEditor from "../../common/RichTextEditor";
import useClickOutside from "../../../hooks/useClickOutside";

const MainTitleAndDesForm = ({ activeElement, control, setValue }) => {
	const [selected, setSelected] = useState(null);
	const titleWrapperRef = useRef(null);
	const titleInputRef = useRef(null);
	const titleToolbarRef = useRef(null);

	const descWrapperRef = useRef(null);
	const descInputRef = useRef(null);
	const descToolbarRef = useRef(null);

	const watchedTitle = useWatch({
		control,
		name: "title",
		defaultValue: "Untitled form",
	});

	const watchedDescription = useWatch({
		control,
		name: "description",
		defaultValue: "",
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
			isDraggable={false}
			hasTopColorBar={true}
		>
			{/* title */}
			<div
				ref={titleWrapperRef}
				onClick={() => setSelected(0)}
				className={`w-full ${
					activeElement
						? selected === 0
							? "border-[#4C2B87] border-b-[1.5px]"
							: "border-[#DADCE0] border-b"
						: "border-transparent border-b"
				}`}
			>
				<RichTextEditor
					ref={titleInputRef}
					value={watchedTitle}
					onChange={(val) =>
						setValue?.("title", val, { shouldDirty: true })
					}
					onFocus={() => setSelected(0)}
					onClick={() => setSelected(0)}
					placeholder="Untitled form"
					className={`text-3xl pb-2 w-full bg-transparent font-normal ${
						!activeElement ? "cursor-pointer" : ""
					}`}
					multiline={false}
				/>
			</div>

			<TextFormattingIcons
				ref={titleToolbarRef}
				targetRef={titleInputRef}
				forDes={false}
				isVisible={activeElement && selected === 0}
				onFormat={(val) =>
					setValue?.("title", val, { shouldDirty: true })
				}
			/>

			{/* description */}
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
						setValue?.("description", val, { shouldDirty: true })
					}
					onFocus={() => setSelected(1)}
					onClick={() => setSelected(1)}
					placeholder="Form description"
					className={`pt-3 text-sm text-[#5f6368] w-full bg-transparent font-normal ${
						!activeElement ? "cursor-pointer" : ""
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
					setValue?.("description", val, { shouldDirty: true })
				}
			/>
		</FormCard>
	);
};

MainTitleAndDesForm.propTypes = {
	activeElement: PropTypes.bool,
	control: PropTypes.object,
	setValue: PropTypes.func,
};

export default MainTitleAndDesForm;
