import { forwardRef, useEffect, useRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";

/**
 * Clean ContentEditable Rich Text input compatible with document.execCommand
 * and React Hook Form.
 */
const RichTextEditor = forwardRef(
	(
		{
			value = "",
			onChange,
			onFocus,
			onBlur,
			onClick,
			placeholder = "",
			className = "",
			multiline = false,
			autoSelectOnFocus = true,
		},
		ref
	) => {
		const editorRef = useRef(null);
		const isFirstFocusRef = useRef(true);

		useImperativeHandle(ref, () => editorRef.current);

		// Synchronize value without resetting cursor if active
		useEffect(() => {
			if (!editorRef.current) return;
			const currentHTML = editorRef.current.innerHTML;
			let targetHTML = value || "";
			if (
				targetHTML.includes("**") ||
				targetHTML.includes("*") ||
				targetHTML.includes("<u>")
			) {
				targetHTML = targetHTML
					.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
					.replace(/\*(.*?)\*/g, "<i>$1</i>")
					.replace(
						/\[(.*?)\]\((.*?)\)/g,
						'<a href="$2" target="_blank" class="text-[#1a73e8] underline hover:text-[#1558d6]">$1</a>'
					);
			}

			if (
				currentHTML !== targetHTML &&
				document.activeElement !== editorRef.current
			) {
				editorRef.current.innerHTML = targetHTML;
			}
		}, [value]);

		const handleInput = () => {
			if (!editorRef.current) return;
			let html = editorRef.current.innerHTML;
			if (html === "<br>" || html === "<div><br></div>") {
				html = "";
			}
			onChange?.(html);
		};

		const handleKeyDown = (e) => {
			// For single-line titles, Enter should not add a line break
			if (!multiline && e.key === "Enter") {
				e.preventDefault();
			}
		};

		const selectAllText = () => {
			if (!editorRef.current) return;
			const range = document.createRange();
			range.selectNodeContents(editorRef.current);
			const sel = window.getSelection();
			sel?.removeAllRanges();
			sel?.addRange(range);
		};

		const handleFocus = (e) => {
			onFocus?.(e);
			if (autoSelectOnFocus && isFirstFocusRef.current) {
				isFirstFocusRef.current = false;
				setTimeout(() => {
					selectAllText();
				}, 10);
			}
		};

		const handleClick = (e) => {
			onClick?.(e);
		};

		return (
			<div
				ref={editorRef}
				contentEditable
				suppressContentEditableWarning
				onInput={handleInput}
				onFocus={handleFocus}
				onBlur={(e) => {
					isFirstFocusRef.current = true;
					handleInput();
					onBlur?.(e);
				}}
				onClick={handleClick}
				onKeyDown={handleKeyDown}
				data-placeholder={placeholder}
				className={`outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 cursor-text [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-0.5 [&_a]:text-[#1a73e8] [&_a]:underline hover:[&_a]:text-[#1558d6] [&_a]:cursor-pointer ${className}`}
			/>
		);
	}
);

RichTextEditor.displayName = "RichTextEditor";

RichTextEditor.propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	onClick: PropTypes.func,
	placeholder: PropTypes.string,
	className: PropTypes.string,
	multiline: PropTypes.bool,
	autoSelectOnFocus: PropTypes.bool,
};

export default RichTextEditor;
