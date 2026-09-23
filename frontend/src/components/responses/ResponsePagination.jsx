import PropTypes from "prop-types";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const ResponsePagination = ({
	currentPage,
	totalPages,
	totalItems,
	itemsPerPage,
	onPageChange,
}) => {
	if (totalPages <= 1) return null;

	const startIdx = (currentPage - 1) * itemsPerPage + 1;
	const endIdx = Math.min(currentPage * itemsPerPage, totalItems);

	return (
		<div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100 mt-6 select-none">
			{/* Range text */}
			<p className="text-xs text-gray-500">
				Showing <span className="font-semibold text-gray-700">{startIdx}</span>–
				<span className="font-semibold text-gray-700">{endIdx}</span> of{" "}
				<span className="font-semibold text-gray-700">{totalItems}</span> responses
			</p>

			{/* Pagination Controls */}
			<div className="flex items-center gap-1.5">
				{/* Previous Button */}
				<button
					type="button"
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
					className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition duration-150 cursor-pointer"
					title="Previous page"
				>
					<MdChevronLeft fontSize="1.3em" />
				</button>

				{/* Page Numbers */}
				<div className="flex items-center gap-1">
					{Array.from({ length: totalPages }, (_, i) => i + 1).map(
						(page) => {
							const isActive = page === currentPage;
							return (
								<button
									key={page}
									type="button"
									onClick={() => onPageChange(page)}
									className={`w-8 h-8 rounded-lg text-xs font-medium transition duration-150 cursor-pointer ${
										isActive
											? "bg-[#673ab7] text-white shadow-xs"
											: "text-gray-600 hover:bg-gray-100 border border-gray-200"
									}`}
								>
									{page}
								</button>
							);
						}
					)}
				</div>

				{/* Next Button */}
				<button
					type="button"
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition duration-150 cursor-pointer"
					title="Next page"
				>
					<MdChevronRight fontSize="1.3em" />
				</button>
			</div>
		</div>
	);
};

ResponsePagination.propTypes = {
	currentPage: PropTypes.number.isRequired,
	totalPages: PropTypes.number.isRequired,
	totalItems: PropTypes.number.isRequired,
	itemsPerPage: PropTypes.number.isRequired,
	onPageChange: PropTypes.func.isRequired,
};

export default ResponsePagination;
