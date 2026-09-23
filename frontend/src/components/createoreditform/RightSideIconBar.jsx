import {
	MdAddCircleOutline,
	MdOutlineImage,
	MdOutlineTextFields,
	MdOutlineAutoAwesome,
} from "react-icons/md";
import PropTypes from "prop-types";

const RightSideIconBar = ({
	onAddAIQuestion,
	onAddQuestion,
	onAddTitle,
	onAddImage,
}) => {
	return (
		<div className="py-2.5 px-1 bg-white rounded-lg border border-[#DADCE0] shadow-md flex flex-col items-center gap-1 select-none">
			{/* 1. ✨ Generate question with AI */}
			{onAddAIQuestion && (
				<button
					type="button"
					onClick={onAddAIQuestion}
					className="p-2 rounded-full hover:bg-purple-50 cursor-pointer text-[#8E24AA] hover:text-[#673ab7] transition duration-150 focus:outline-none relative group"
					title="Generate question with AI"
				>
					<MdOutlineAutoAwesome fontSize="1.45em" className="group-hover:scale-110 transition duration-150" />
				</button>
			)}

			{/* 2. Add question */}
			<button
				type="button"
				onClick={onAddQuestion}
				className="p-2 rounded-full hover:bg-slate-100 cursor-pointer text-[#5f6368] hover:text-[#202124] transition duration-150 focus:outline-none"
				title="Add question"
			>
				<MdAddCircleOutline fontSize="1.45em" />
			</button>

			{/* 3. Add title and description */}
			<button
				type="button"
				onClick={onAddTitle}
				className="p-2 rounded-full hover:bg-slate-100 cursor-pointer text-[#5f6368] hover:text-[#202124] transition duration-150 focus:outline-none"
				title="Add title and description"
			>
				<MdOutlineTextFields fontSize="1.45em" />
			</button>

			{/* 4. Add image */}
			<button
				type="button"
				onClick={onAddImage}
				className="p-2 rounded-full hover:bg-slate-100 cursor-pointer text-[#5f6368] hover:text-[#202124] transition duration-150 focus:outline-none"
				title="Add image"
			>
				<MdOutlineImage fontSize="1.45em" />
			</button>
		</div>
	);
};

RightSideIconBar.propTypes = {
	onAddAIQuestion: PropTypes.func,
	onAddQuestion: PropTypes.func.isRequired,
	onAddTitle: PropTypes.func.isRequired,
	onAddImage: PropTypes.func.isRequired,
};

export default RightSideIconBar;
