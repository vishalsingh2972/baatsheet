import PropTypes from "prop-types";
import { MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";

const PreviewCheckboxQuestion = ({
	options,
	checkedMap,
	otherText,
	onToggleOption,
	onToggleOther,
	onOtherTextChange,
}) => {
	return (
		<div className="flex flex-col gap-4 pl-1">
			{options.map((option, optIdx) => {
				const isOther = option === "__OTHER__" || option === "Other...";

				if (isOther) {
					const isChecked = Boolean(checkedMap["__OTHER__"]);
					return (
						<div
							key={optIdx}
							className="flex items-center gap-3.5 group py-0.5"
						>
							<div
								onClick={onToggleOther}
								className="flex-shrink-0 cursor-pointer transition duration-150"
							>
								{isChecked ? (
									<MdCheckBox
										fontSize="1.45em"
										className="text-[#673ab7]"
									/>
								) : (
									<MdCheckBoxOutlineBlank
										fontSize="1.45em"
										className="text-[#5f6368] group-hover:text-[#202124]"
									/>
								)}
							</div>
							<span
								onClick={onToggleOther}
								className="text-sm md:text-base text-[#202124] select-none cursor-pointer whitespace-nowrap"
							>
								Other:
							</span>
							<input
								type="text"
								value={otherText}
								onFocus={() => {
									if (!isChecked) onToggleOther();
								}}
								onChange={(e) => onOtherTextChange(e.target.value)}
								className="border-b border-[#dadce0] focus:border-b-2 focus:border-[#673ab7] outline-none text-sm text-[#202124] pb-0.5 bg-transparent flex-grow transition-colors duration-150"
							/>
						</div>
					);
				}

				const isChecked = Boolean(checkedMap[option]);
				return (
					<label
						key={optIdx}
						className="flex items-center gap-3.5 cursor-pointer group"
						onClick={() => onToggleOption(option)}
					>
						<div className="flex-shrink-0 transition duration-150">
							{isChecked ? (
								<MdCheckBox
									fontSize="1.45em"
									className="text-[#673ab7]"
								/>
							) : (
								<MdCheckBoxOutlineBlank
									fontSize="1.45em"
									className="text-[#5f6368] group-hover:text-[#202124]"
								/>
							)}
						</div>
						<span className="text-sm md:text-base text-[#202124] group-hover:text-black select-none">
							{option}
						</span>
					</label>
				);
			})}
		</div>
	);
};

PreviewCheckboxQuestion.propTypes = {
	options: PropTypes.arrayOf(PropTypes.string).isRequired,
	checkedMap: PropTypes.object.isRequired,
	otherText: PropTypes.string,
	onToggleOption: PropTypes.func.isRequired,
	onToggleOther: PropTypes.func.isRequired,
	onOtherTextChange: PropTypes.func.isRequired,
};

export default PreviewCheckboxQuestion;
