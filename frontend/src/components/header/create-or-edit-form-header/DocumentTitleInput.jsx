import { useState, useRef, useLayoutEffect, useEffect } from "react";
import PropTypes from "prop-types";
import { useUpdateFormNameMutation } from "../../../redux/api/formApi";

const DocumentTitleInput = ({
	formId,
	formName = "Untitled form",
	onNameChange,
	onSaveStatusChange,
}) => {
	const [localName, setLocalName] = useState(formName);
	const spanRef = useRef(null);
	const [inputWidth, setInputWidth] = useState(115);

	const [updateFormName] = useUpdateFormNameMutation();

	// Sync localName when external formName updates (e.g. after server data loads)
	useEffect(() => {
		setLocalName(formName || "Untitled form");
	}, [formName]);

	// Synchronously measure exact text width
	useLayoutEffect(() => {
		if (spanRef.current) {
			const textWidth = spanRef.current.offsetWidth;
			setInputWidth(Math.min(350, Math.max(textWidth + 6, 20)));
		}
	}, [localName]);

	const handleBlur = () => {
		const finalName = localName.trim() || "Untitled form";
		setLocalName(finalName);

		// Only save if name actually changed
		if (finalName !== formName) {
			onNameChange?.(finalName);

			if (formId) {
				updateFormName({ id: formId, name: finalName })
					.unwrap()
					.then(() => onSaveStatusChange?.("saved"))
					.catch((err) => {
						console.error("Header name save error:", err);
						onSaveStatusChange?.("error");
					});
			}
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			e.target.blur();
		}
	};

	return (
		<>
			{/* Invisible measurement element to calculate pixel-perfect text width */}
			<span
				ref={spanRef}
				aria-hidden="true"
				className="absolute -left-[9999px] -top-[9999px] invisible whitespace-pre font-normal text-lg md:text-xl px-1"
			>
				{localName || "Untitled form"}
			</span>

			{/* Exact-width input - saves only on defocus / blur */}
			<input
				type="text"
				value={localName}
				onChange={(e) => setLocalName(e.target.value)}
				onFocus={(e) => e.target.select()}
				onBlur={handleBlur}
				onKeyDown={handleKeyDown}
				style={{ width: `${inputWidth}px` }}
				className="font-normal text-[#1f1f1f] text-lg md:text-xl ml-4 mr-2 bg-transparent outline-none border-b-2 border-transparent hover:border-gray-300 focus:border-[#673ab7] px-1 py-0.5 rounded transition-[border-color] duration-150 truncate"
				placeholder="Untitled form"
				title="Rename form"
			/>
		</>
	);
};

DocumentTitleInput.propTypes = {
	formId: PropTypes.string,
	formName: PropTypes.string,
	onNameChange: PropTypes.func,
	onSaveStatusChange: PropTypes.func,
};

export default DocumentTitleInput;
