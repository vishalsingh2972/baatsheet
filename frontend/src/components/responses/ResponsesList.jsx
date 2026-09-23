import PropTypes from "prop-types";
import ResponseCardItem from "./ResponseCardItem";
import ResponsePagination from "./ResponsePagination";

const ResponsesList = ({
	responses,
	form,
	startIndex,
	expandedId,
	onToggleExpand,
	currentPage,
	totalPages,
	totalItems,
	itemsPerPage,
	onPageChange,
}) => {
	return (
		<>
			{/* Expandable Master-Detail List */}
			<div className="flex flex-col gap-3">
				{responses.map((resp, idx) => {
					const actualIndex = startIndex + idx;
					return (
						<ResponseCardItem
							key={resp._id}
							response={resp}
							index={actualIndex}
							form={form}
							isExpanded={expandedId === resp._id}
							onToggle={() => onToggleExpand(resp._id)}
						/>
					);
				})}
			</div>

			{/* Pagination Controls */}
			<ResponsePagination
				currentPage={currentPage}
				totalPages={totalPages}
				totalItems={totalItems}
				itemsPerPage={itemsPerPage}
				onPageChange={onPageChange}
			/>
		</>
	);
};

ResponsesList.propTypes = {
	responses: PropTypes.array.isRequired,
	form: PropTypes.object,
	startIndex: PropTypes.number.isRequired,
	expandedId: PropTypes.string,
	onToggleExpand: PropTypes.func.isRequired,
	currentPage: PropTypes.number.isRequired,
	totalPages: PropTypes.number.isRequired,
	totalItems: PropTypes.number.isRequired,
	itemsPerPage: PropTypes.number.isRequired,
	onPageChange: PropTypes.func.isRequired,
};

export default ResponsesList;
