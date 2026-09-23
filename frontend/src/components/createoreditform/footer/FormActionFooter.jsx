import PropTypes from "prop-types";

const FormActionFooter = ({ onSave, isSaving, isEdit, saveMessage }) => {
	return (
		<div className="flex items-center gap-4 mt-6">
			<button
				onClick={onSave}
				disabled={isSaving}
				className="bg-[#673ab7] hover:bg-[#5a2ea6] text-white px-8 py-2.5 rounded-lg shadow-md font-medium transition duration-150 disabled:opacity-50 flex items-center gap-2"
			>
				{isSaving && (
					<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
				)}
				<span>
					{isSaving
						? "Saving..."
						: isEdit
						? "Update Form"
						: "Save Form"}
				</span>
			</button>

			{saveMessage && (
				<span
					className={`text-sm font-medium ${
						saveMessage.includes("Error")
							? "text-red-500"
							: "text-green-600"
					} animate-fadeIn`}
				>
					{saveMessage}
				</span>
			)}
		</div>
	);
};

FormActionFooter.propTypes = {
	onSave: PropTypes.func.isRequired,
	isSaving: PropTypes.bool.isRequired,
	isEdit: PropTypes.bool,
	saveMessage: PropTypes.string,
};

export default FormActionFooter;
