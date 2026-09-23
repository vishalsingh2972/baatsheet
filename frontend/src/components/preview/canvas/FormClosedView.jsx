import PropTypes from "prop-types";

const FormClosedView = ({ headerImage, title, closedFormMessage }) => {
	return (
		<div className="w-full max-w-[770px] mx-auto px-4 pt-3 pb-8 md:pt-4 md:pb-12">
			{headerImage && (
				<div className="w-full h-[160px] md:h-[200px] rounded-lg overflow-hidden bg-white border border-[#dadce0] shadow-sm mb-4">
					<img
						src={headerImage}
						alt="Form header"
						className="w-full h-full object-cover"
					/>
				</div>
			)}

			<div className="w-full bg-white rounded-lg border border-[#dadce0] border-t-8 border-t-[#673ab7] p-8 shadow-sm">
				<h1 className="text-2xl md:text-3xl font-normal text-[#202124] mb-3">
					{title || "Untitled form"}
				</h1>
				<p className="text-base text-[#202124] mb-6">
					{closedFormMessage || "This form is no longer accepting responses."}
				</p>
				<p className="text-xs text-[#5f6368]">
					Try contacting the owner of the form if you think this is a mistake.
				</p>
			</div>

			<div className="text-center mt-10 text-xs text-gray-400">
				<p>This form was created inside Google Form Clone.</p>
			</div>
		</div>
	);
};

FormClosedView.propTypes = {
	headerImage: PropTypes.string,
	title: PropTypes.string,
	closedFormMessage: PropTypes.string,
};

export default FormClosedView;
