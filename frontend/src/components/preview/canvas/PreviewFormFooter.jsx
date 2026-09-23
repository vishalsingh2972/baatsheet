import PropTypes from "prop-types";

const PreviewFormFooter = ({ isViewMode, isSubmitting, onClearForm }) => {
	return (
		<>
			{/* Bottom Action Footer */}
			<div className="flex items-center justify-between mt-6 px-1">
				<div className="flex items-center gap-4">
					{isViewMode ? (
						<button
							type="submit"
							disabled={isSubmitting}
							className="px-6 py-2 bg-[#673ab7] hover:bg-[#5a2ea6] text-white text-sm font-medium rounded shadow-sm transition duration-150 cursor-pointer disabled:opacity-50"
						>
							{isSubmitting ? "Submitting..." : "Submit"}
						</button>
					) : (
						<button
							type="button"
							disabled
							className="px-6 py-2 bg-[#673ab7] text-white text-sm font-medium rounded opacity-50 cursor-not-allowed shadow-none"
							title="Submit is disabled in Preview mode"
						>
							Submit
						</button>
					)}

					<button
						type="button"
						onClick={onClearForm}
						className="text-sm text-[#673ab7] hover:bg-purple-50 px-3 py-1.5 rounded transition duration-150 cursor-pointer"
					>
						Clear form
					</button>
				</div>

				{!isViewMode && (
					<span className="text-xs text-gray-400 italic">
						Submit is disabled in Preview mode
					</span>
				)}
			</div>

			{/* Google Forms Disclaimer Footer */}
			<div className="text-center mt-10 text-xs text-gray-400">
				<p>This form was created inside Google Form Clone.</p>
			</div>
		</>
	);
};

PreviewFormFooter.propTypes = {
	isViewMode: PropTypes.bool.isRequired,
	isSubmitting: PropTypes.bool.isRequired,
	onClearForm: PropTypes.func.isRequired,
};

export default PreviewFormFooter;
