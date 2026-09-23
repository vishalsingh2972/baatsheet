/* eslint-disable react/prop-types */

import { MdCheckBoxOutlineBlank, MdOutlineCircle } from "react-icons/md";
import RenderOptionWithIcon from "./RenderOptionWithIcon";

// Helper component for Short and Long Answer
const RenderAnswerOption = ({ label, hrWidth }) => (
	<div className="mt-4">
		<p className="text-[#70757a] text-sm mb-1.5 select-none">{label}</p>
		<div
			className={`border-b border-dotted border-[#70757a] ${hrWidth}`}
		/>
	</div>
);

const OptionBasedDetails = ({
	selectOption,
	activeElement = true,
	control,
	register,
	setValue,
	index,
	onOptionFocus,
}) => {
	const renderOption = () => {
		switch (selectOption) {
			case "shortanswer":
				return (
					<RenderAnswerOption
						label="Short answer text"
						hrWidth="w-1/2"
					/>
				);

			case "paragraph":
				return (
					<RenderAnswerOption
						label="Long answer text"
						hrWidth="w-full"
					/>
				);

			case "multiplechoice":
			case "dropdown":
				return (
					<RenderOptionWithIcon
						activeElement={activeElement}
						control={control}
						register={register}
						setValue={setValue}
						index={index}
						onOptionFocus={onOptionFocus}
						icon={
							<MdOutlineCircle fontSize="1.5em" color="#c8cbd0" />
						}
					/>
				);

			case "checkbox":
				return (
					<RenderOptionWithIcon
						activeElement={activeElement}
						control={control}
						register={register}
						setValue={setValue}
						index={index}
						onOptionFocus={onOptionFocus}
						icon={
							<MdCheckBoxOutlineBlank
								fontSize="1.5em"
								color="#c8cbd0"
							/>
						}
					/>
				);

			default:
				return (
					<p className="text-[#70757a] text-sm">
						Select an option to display details
					</p>
				);
		}
	};

	return <>{renderOption()}</>;
};

export default OptionBasedDetails;
