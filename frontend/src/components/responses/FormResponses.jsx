import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
	useGetFormByIdQuery,
	useGetFormResponsesQuery,
	useDeleteAllResponsesMutation,
	useUpdateFormMutation,
} from "../../redux/api/formApi";
import useAuth from "../../hooks/useAuth";
import { exportResponsesToCSV } from "../../utils/exportResponsesCsv";
import ResponsesAuthPrompt from "./ResponsesAuthPrompt";
import ResponsesHeader from "./ResponsesHeader";
import ResponsesAIInsights from "./ResponsesAIInsights";
import ResponsesEmptyState from "./ResponsesEmptyState";
import ResponsesList from "./ResponsesList";
import DeleteResponsesModal from "../modals/DeleteResponsesModal";

const ITEMS_PER_PAGE = 10;

const FormResponses = ({ formId }) => {
	const { isAuthenticated } = useAuth();
	const [currentPage, setCurrentPage] = useState(1);
	const [expandedId, setExpandedId] = useState(null);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const { data: form } = useGetFormByIdQuery(formId, {
		skip: !formId || !isAuthenticated,
	});
	const {
		data: responses,
		isLoading,
		refetch,
	} = useGetFormResponsesQuery(formId, {
		skip: !formId || !isAuthenticated,
		refetchOnMountOrArgChange: true,
		refetchOnFocus: true,
	});

	useEffect(() => {
		if (formId && isAuthenticated) {
			refetch();
		}
	}, [formId, isAuthenticated, refetch]);
	const [updateForm] = useUpdateFormMutation();
	const [deleteAllResponses, { isLoading: isDeleting }] =
		useDeleteAllResponsesMutation();

	if (!isAuthenticated) {
		return <ResponsesAuthPrompt />;
	}

	const totalResponses = responses?.length || 0;
	const totalPages = Math.ceil(totalResponses / ITEMS_PER_PAGE) || 1;
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const currentResponses =
		responses?.slice(startIndex, startIndex + ITEMS_PER_PAGE) || [];

	const isAccepting = form?.settings?.isAcceptingResponses !== false;

	const handleToggleAccepting = async (newVal) => {
		if (!formId) return;
		try {
			await updateForm({
				id: formId,
				settings: {
					...form?.settings,
					isAcceptingResponses: newVal,
				},
			}).unwrap();
		} catch (err) {
			console.error("Failed to update accepting responses state:", err);
		}
	};

	const handleDeleteAll = async () => {
		if (!formId) return;
		try {
			await deleteAllResponses(formId).unwrap();
			setIsDeleteModalOpen(false);
			setCurrentPage(1);
			setExpandedId(null);
		} catch (err) {
			console.error("Failed to delete all responses:", err);
			alert(err?.data?.message || "Failed to delete responses.");
		}
	};

	return (
		<main className="w-full h-full flex flex-col items-center pt-28 pb-20 overflow-y-scroll scroll-smooth">
			<div className="w-full max-w-[780px] px-4">
				<div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
					<ResponsesHeader
						totalResponses={totalResponses}
						formTitle={form?.title}
						onExportCSV={() => exportResponsesToCSV(form, responses)}
						onDeleteAllClick={() => setIsDeleteModalOpen(true)}
						isAcceptingResponses={isAccepting}
						onToggleAcceptingResponses={handleToggleAccepting}
					/>

					{totalResponses > 0 && (
						<ResponsesAIInsights
							formId={formId}
							formTitle={form?.title}
							questions={form?.items || []}
							responses={responses || []}
						/>
					)}

					{isLoading ? (
						<div className="text-center py-16">
							<div className="w-8 h-8 border-4 border-[#673ab7] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
							<p className="text-xs text-gray-400">Loading responses...</p>
						</div>
					) : totalResponses > 0 ? (
						<ResponsesList
							responses={currentResponses}
							form={form}
							startIndex={startIndex}
							expandedId={expandedId}
							onToggleExpand={(id) =>
								setExpandedId((prev) => (prev === id ? null : id))
							}
							currentPage={currentPage}
							totalPages={totalPages}
							totalItems={totalResponses}
							itemsPerPage={ITEMS_PER_PAGE}
							onPageChange={(page) => {
								setCurrentPage(page);
								setExpandedId(null);
							}}
						/>
					) : (
						<ResponsesEmptyState />
					)}
				</div>
			</div>

			<DeleteResponsesModal
				isOpen={isDeleteModalOpen}
				formName={form?.title}
				responseCount={totalResponses}
				isLoading={isDeleting}
				onConfirm={handleDeleteAll}
				onClose={() => setIsDeleteModalOpen(false)}
			/>
		</main>
	);
};

FormResponses.propTypes = {
	formId: PropTypes.string,
};

export default FormResponses;
