import PropTypes from "prop-types";
import { MdOutlineAutoAwesome } from "react-icons/md";

const AIModalFooter = ({
	mode,
	isLoading,
	previewData,
	onClose,
	onGenerate,
	onAcceptForm,
}) => {
	if (isLoading) {
		return <div className="h-16 shrink-0 border-t border-transparent" />;
	}

	if (mode === "prompt") {
		return (
			<div className="h-16 shrink-0 flex items-center justify-end gap-2 px-6 bg-[#F8F9FA] border-t border-[#E0E2EC]">
				<button
					type="button"
					onClick={onClose}
					className="px-4 py-2 text-sm font-medium text-[#5F6368] hover:bg-slate-200/60 rounded-lg transition cursor-pointer"
				>
					Cancel
				</button>
				<button
					type="button"
					onClick={onGenerate}
					className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#673AB7] to-[#7E57C2] hover:from-[#5E35B1] hover:to-[#673AB7] rounded-xl shadow-sm hover:shadow transition cursor-pointer flex items-center gap-1.5"
				>
					<MdOutlineAutoAwesome className="text-base" />
					<span>Generate Form</span>
				</button>
			</div>
		);
	}

	return (
		<div className="h-16 shrink-0 flex items-center justify-between px-6 bg-white border-t border-gray-100">
			<span className="text-xs text-gray-500 font-medium">
				✨ {previewData?.items?.length || 0} questions generated
			</span>

			<button
				type="button"
				onClick={onAcceptForm}
				className="px-7 py-2.5 text-sm font-medium text-white bg-[#0B57D0] hover:bg-[#0842A0] rounded-full shadow-sm hover:shadow transition cursor-pointer flex items-center gap-2"
			>
				<span>Create form</span>
			</button>
		</div>
	);
};

AIModalFooter.propTypes = {
	mode: PropTypes.string.isRequired,
	isLoading: PropTypes.bool.isRequired,
	previewData: PropTypes.shape({
		items: PropTypes.arrayOf(PropTypes.object),
	}),
	onClose: PropTypes.func.isRequired,
	onGenerate: PropTypes.func.isRequired,
	onAcceptForm: PropTypes.func.isRequired,
};

export default AIModalFooter;
