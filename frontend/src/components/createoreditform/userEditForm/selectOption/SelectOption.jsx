import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
	MdArrowDropDown,
	MdOutlineShortText,
	MdOutlineSubject,
	MdRadioButtonChecked,
} from "react-icons/md";
import { FaRegCheckSquare } from "react-icons/fa";
import Option from "./Option";

const SelectOption = ({ selectOption, setSelectOption }) => {
	const [showModal, setShowModal] = useState(false);
	const dropdownRef = useRef(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
				setShowModal(false);
			}
		};
		if (showModal) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [showModal]);

	const onModalShow = (value) => {
		setShowModal(value);
	};

	const onSelectOption = (value) => {
		setSelectOption(value);
		setShowModal(false);
	};

	const normalizedTrackId = selectOption === "dropdown" ? "multiplechoice" : selectOption;
	const initialOption =
		SelectOptionData.find((option) => option.trackId === normalizedTrackId) ||
		SelectOptionData[2];

	return (
		<div
			ref={dropdownRef}
			className="relative flex items-center justify-center w-56 shrink-0 h-12 rounded border border-[#c8cbd0] bg-white hover:bg-slate-50 transition"
		>
			<div
				onClick={() => setShowModal((prev) => !prev)}
				className="flex items-center justify-between w-full h-full cursor-pointer px-3 select-none"
			>
				<div className="flex items-center gap-2.5 min-w-0">
					<span className="shrink-0">{initialOption.modalIcon}</span>
					<p className="text-sm text-[#202124] whitespace-nowrap truncate font-normal">
						{initialOption.modalText}
					</p>
				</div>

				<MdArrowDropDown fontSize="1.5em" color="#5f6368" className="shrink-0" />
			</div>

			{showModal && (
				<div className="absolute top-14 right-0 min-w-full w-56 bg-white rounded-lg border border-[#c8cbd0] py-2 z-30 shadow-xl">
					<Option
						onModalShow={onModalShow}
						onSelectOption={onSelectOption}
						selectOption={selectOption}
						SelectOptionData={SelectOptionData}
					/>
				</div>
			)}
		</div>
	);
};

SelectOption.propTypes = {
	selectOption: PropTypes.string,
	setSelectOption: PropTypes.func.isRequired,
};

export default SelectOption;

const SelectOptionData = [
	{
		id: 0,
		trackId: "shortanswer",
		modalText: "Short answer",
		modalIcon: <MdOutlineShortText fontSize="1.5em" color="#5f6368" />,
	},
	{
		id: 1,
		trackId: "paragraph",
		modalText: "Paragraph",
		modalIcon: <MdOutlineSubject fontSize="1.5em" color="#5f6368" />,
	},
	{
		id: 2,
		trackId: "multiplechoice",
		modalText: "Multiple choice",
		modalIcon: <MdRadioButtonChecked fontSize="1.5em" color="#5f6368" />,
	},
	{
		id: 3,
		trackId: "checkbox",
		modalText: "Checkboxes",
		modalIcon: <FaRegCheckSquare fontSize="1.5em" color="#5f6368" />,
	},
];
