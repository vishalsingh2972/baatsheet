const ResponsesEmptyState = () => {
	return (
		<div className="text-center py-16 px-4">
			<div className="w-16 h-16 bg-[#673ab7]/10 text-[#673ab7] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
				0
			</div>
			<h3 className="text-lg font-medium text-gray-800 mb-1">
				Waiting for responses
			</h3>
			<p className="text-sm text-gray-400 max-w-[360px] mx-auto leading-relaxed">
				No responses have been submitted yet. Share your form link to
				start collecting submissions!
			</p>
		</div>
	);
};

export default ResponsesEmptyState;
