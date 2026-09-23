import PropTypes from "prop-types";
import { BsPencil, BsTrash } from "react-icons/bs";

const FormCardMenu = ({ onRename, onDelete }) => {
	return (
		<div className="absolute right-14 top-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-30 animate-fadeIn">
			<button
				type="button"
				onClick={onRename}
				className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-[#202124] hover:bg-gray-50 cursor-pointer transition duration-150"
			>
				<BsPencil className="text-gray-500" />
				<span>Rename</span>
			</button>
			<button
				type="button"
				onClick={onDelete}
				className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition duration-150"
			>
				<BsTrash />
				<span>Delete form</span>
			</button>
		</div>
	);
};

FormCardMenu.propTypes = {
	onRename: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
};

export default FormCardMenu;
