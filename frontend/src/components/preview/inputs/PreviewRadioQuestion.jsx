import PropTypes from "prop-types";
import { MdRadioButtonUnchecked, MdRadioButtonChecked } from "react-icons/md";

const PreviewRadioQuestion = ({
	options,
	localAnswer,
	otherText,
	onSelectOption,
	onSelectOther,
	onOtherTextChange,
	onClear,
}) => {
	return (
		<div className="flex flex-col gap-4 pl-1">
			{options.map((option, optIdx) => {
				const isOther = option === "__OTHER__" || option === "Other...";

				if (isOther) {
					const isSelected = localAnswer === "__OTHER__";
					return (
						<div
							key={optIdx}
							className="flex items-center gap-3.5 group py-0.5"
						>
							<div
								onClick={onSelectOther}
								className="flex-shrink-0 cursor-pointer transition duration-150"
							>
								{isSelected ? (
									<MdRadioButtonChecked
										fontSize="1.45em"
										className="text-[#673ab7]"
									/>
								) : (
									<MdRadioButtonUnchecked
										fontSize="1.45em"
										className="text-[#5f6368] group-hover:text-[#202124]"
									/>
								)}
							</div>
							<span
								onClick={onSelectOther}
								className="text-sm md:text-base text-[#202124] select-none cursor-pointer whitespace-nowrap"
							>
								Other:
							</span>
							<input
								type="text"
								value={otherText}
								onFocus={onSelectOther}
								onChange={(e) => onOtherTextChange(e.target.value)}
								className="border-b border-[#dadce0] focus:border-b-2 focus:border-[#673ab7] outline-none text-sm text-[#202124] pb-0.5 bg-transparent flex-grow transition-colors duration-150"
							/>
						</div>
					);
				}

				const isSelected = localAnswer === option;
				return (
					<label
						key={optIdx}
						className="flex items-center gap-3.5 cursor-pointer group"
						onClick={() => onSelectOption(option)}
					>
						<div className="flex-shrink-0 transition duration-150">
							{isSelected ? (
								<MdRadioButtonChecked
									fontSize="1.45em"
									className="text-[#673ab7]"
								/>
							) : (
								<MdRadioButtonUnchecked
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

			{/* Clear Selection Button */}
			{localAnswer && (
				<div className="flex justify-end pt-1">
					<button
						type="button"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							onClear();
						}}
						className="text-xs font-medium text-[#5f6368] hover:text-[#202124] hover:bg-slate-100 px-2.5 py-1.5 rounded transition duration-150 focus:outline-none cursor-pointer"
					>
						Clear selection
					</button>
				</div>
			)}
		</div>
	);
};

PreviewRadioQuestion.propTypes = {
	options: PropTypes.arrayOf(PropTypes.string).isRequired,
	localAnswer: PropTypes.string,
	otherText: PropTypes.string,
	onSelectOption: PropTypes.func.isRequired,
	onSelectOther: PropTypes.func.isRequired,
	onOtherTextChange: PropTypes.func.isRequired,
	onClear: PropTypes.func.isRequired,
};

export default PreviewRadioQuestion;
