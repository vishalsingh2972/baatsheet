/* eslint-disable react/prop-types */

const Option = ({
	onModalShow,
	onSelectOption,
	selectOption,
	SelectOptionData,
}) => {
	return (
		<>
			{SelectOptionData.map((option) => (
				<div
					key={option.trackId}
					onClick={() => {
						onModalShow(false);
						onSelectOption(option.trackId);
					}}
					className={`flex py-3 pl-2 gap-3 ${
						option.trackId === selectOption
							? "bg-slate-100"
							: "bg-white"
					}  hover:bg-gray-200 cursor-pointer`}
				>
					{option.modalIcon}
					<p className="text-sm">{option.modalText}</p>
				</div>
			))}
		</>
	);
};

export default Option;
