import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
	useGetFormsQuery,
	useDeleteFormMutation,
	useUpdateFormNameMutation,
	useToggleFormStarMutation,
} from "../../../redux/api/formApi";
import useAuth from "../../../hooks/useAuth";
import FormCard from "./FormCard";
import FormCardMenu from "./FormCardMenu";
import FormsFilterTabs from "./FormsFilterTabs";
import FormsSortDropdown from "./FormsSortDropdown";
import RenameFormModal from "./RenameFormModal";
import DeleteFormModal from "./DeleteFormModal";

const RecentForms = ({ searchQuery = "", onClearSearch }) => {
	const { isAuthenticated } = useAuth();
	const { data: forms, isLoading, isError } = useGetFormsQuery(undefined, {
		skip: !isAuthenticated,
	});
	const [deleteForm] = useDeleteFormMutation();
	const [updateFormName] = useUpdateFormNameMutation();
	const [toggleFormStar] = useToggleFormStarMutation();

	const [filterTab, setFilterTab] = useState("all");
	const [sortOrder, setSortOrder] = useState(() => {
		return (
			localStorage.getItem("google_forms_sort_order") ||
			"last_modified_desc"
		);
	});
	const [activeMenuId, setActiveMenuId] = useState(null);
	const [renameModal, setRenameModal] = useState({ open: false, form: null });
	const [deleteModal, setDeleteModal] = useState({ open: false, form: null });
	const menuRef = useRef(null);

	const handleSortChange = (newSort) => {
		setSortOrder(newSort);
		localStorage.setItem("google_forms_sort_order", newSort);
	};

	// Close dropdown when clicking outside (ignoring clicks on the trigger button)
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(e.target) &&
				!e.target.closest('button[data-menu-trigger="true"]')
			) {
				setActiveMenuId(null);
			}
		};
		if (activeMenuId) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [activeMenuId]);

	const handleMenuToggle = (formId) => {
		setActiveMenuId((prev) => (prev === formId ? null : formId));
	};

	const handleStarToggle = async (formId, newStarState) => {
		try {
			await toggleFormStar({ id: formId, isStarred: newStarState }).unwrap();
		} catch (err) {
			console.error("Failed to toggle star:", err);
		}
	};

	const handleRenameOpen = (e, form) => {
		e.preventDefault();
		e.stopPropagation();
		setActiveMenuId(null);
		setRenameModal({ open: true, form });
	};

	const handleRenameConfirm = async (newName) => {
		if (!renameModal.form) return;
		try {
			await updateFormName({ id: renameModal.form._id, name: newName }).unwrap();
		} catch (err) {
			console.error("Failed to rename form:", err);
		}
	};

	const handleDeleteOpen = (e, form) => {
		e.preventDefault();
		e.stopPropagation();
		setActiveMenuId(null);
		setDeleteModal({ open: true, form });
	};

	const handleDeleteConfirm = async () => {
		if (!deleteModal.form) return;
		try {
			await deleteForm(deleteModal.form._id).unwrap();
			setDeleteModal({ open: false, form: null });
		} catch (err) {
			console.error("Failed to delete form:", err);
		}
	};

	if (!isAuthenticated) return <SignInPrompt />;

	// Filter by Starred tab
	const tabFilteredForms = forms
		? filterTab === "starred"
			? forms.filter((f) => f.isStarred)
			: forms
		: [];

	// Filter by document name search query
	const query = searchQuery.trim().toLowerCase();
	const filteredForms = query
		? tabFilteredForms.filter((f) => {
				const formName = (f.name || f.title || "Untitled form").toLowerCase();
				return formName.includes(query);
		  })
		: tabFilteredForms;

	// Sort forms according to selected sort order
	const displayedForms = [...filteredForms].sort((a, b) => {
		if (sortOrder === "last_modified_asc") {
			return new Date(a.updatedAt || 0) - new Date(b.updatedAt || 0);
		}
		if (sortOrder === "title_asc") {
			const nameA = (a.name || a.title || "Untitled form").toLowerCase();
			const nameB = (b.name || b.title || "Untitled form").toLowerCase();
			return nameA.localeCompare(nameB);
		}
		if (sortOrder === "title_desc") {
			const nameA = (a.name || a.title || "Untitled form").toLowerCase();
			const nameB = (b.name || b.title || "Untitled form").toLowerCase();
			return nameB.localeCompare(nameA);
		}
		if (sortOrder === "created_desc") {
			return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
		}
		// Default: last_modified_desc
		return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
	});

	const starredFormsCount = forms ? forms.filter((f) => f.isStarred).length : 0;

	return (
		<section className="mx-4 md:mx-[137px] pb-16">
			<div className="flex items-center justify-between mt-6 mb-5 px-3 flex-wrap gap-3">
				<p className="text-lg font-medium text-[#202124]">
					{query ? `Search results for "${searchQuery}"` : "Recent forms"}
				</p>

				<div className="flex items-center gap-2.5">
					<FormsSortDropdown
						currentSort={sortOrder}
						onSortChange={handleSortChange}
					/>

					<FormsFilterTabs
						filterTab={filterTab}
						onFilterChange={setFilterTab}
						allCount={forms ? forms.length : 0}
						starredCount={starredFormsCount}
					/>
				</div>
			</div>

			{isLoading && <LoadingSpinner />}
			{isError && <ErrorMessage />}

			{/* Form List */}
			{!isLoading && !isError && displayedForms.length > 0 && (
				<div className="flex flex-col gap-1">
					{displayedForms.map((form) => (
						<div key={form._id}>
							<div className="relative">
								<FormCard
									form={form}
									isMenuOpen={activeMenuId === form._id}
									onMenuToggle={handleMenuToggle}
									onStarToggle={handleStarToggle}
								/>

								{activeMenuId === form._id && (
									<div ref={menuRef}>
										<FormCardMenu
											onRename={(e) => handleRenameOpen(e, form)}
											onDelete={(e) => handleDeleteOpen(e, form)}
										/>
									</div>
								)}
							</div>
							<div className="w-full h-px bg-[#f1f3f4]" />
						</div>
					))}
				</div>
			)}

			{/* Empty search results state */}
			{!isLoading && !isError && forms && forms.length > 0 && displayedForms.length === 0 && query && (
				<EmptySearchState
					query={searchQuery}
					onClearSearch={onClearSearch}
				/>
			)}

			{/* Empty starred state */}
			{!isLoading && !isError && forms && forms.length > 0 && displayedForms.length === 0 && !query && filterTab === "starred" && (
				<EmptyStarredState />
			)}

			{/* Empty all forms state */}
			{!isLoading && !isError && (!forms || forms.length === 0) && (
				<EmptyState />
			)}

			<RenameFormModal
				isOpen={renameModal.open}
				currentName={
					renameModal.form?.name ||
					renameModal.form?.title ||
					"Untitled form"
				}
				onConfirm={handleRenameConfirm}
				onClose={() => setRenameModal({ open: false, form: null })}
			/>

			<DeleteFormModal
				isOpen={deleteModal.open}
				formName={
					deleteModal.form?.name ||
					deleteModal.form?.title ||
					"Untitled form"
				}
				onConfirm={handleDeleteConfirm}
				onClose={() => setDeleteModal({ open: false, form: null })}
			/>
		</section>
	);
};

RecentForms.propTypes = {
	searchQuery: PropTypes.string,
	onClearSearch: PropTypes.func,
};

// ── Small inline sub-views ───────────────────────────────────────────────────

const SignInPrompt = () => (
	<section className="mx-4 md:mx-[137px] py-12 text-center">
		<p className="text-lg font-medium text-[#202124] mb-2">Recent forms</p>
		<p className="text-gray-500 mb-4 text-sm">
			Please sign in to view and manage your forms.
		</p>
		<Link
			to="/login"
			className="inline-block px-5 py-2 bg-[#673ab7] text-white text-sm font-medium rounded-lg hover:bg-[#5a2ea6] transition duration-150"
		>
			Sign In
		</Link>
	</section>
);

const LoadingSpinner = () => (
	<div className="flex justify-center items-center py-10">
		<div className="w-8 h-8 border-4 border-[#673ab7] border-t-transparent rounded-full animate-spin" />
	</div>
);

const ErrorMessage = () => (
	<div className="text-center py-8 text-red-500 text-sm">
		Failed to load forms. Please refresh the page.
	</div>
);

const EmptySearchState = ({ query, onClearSearch }) => (
	<div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
		<p className="text-base font-medium text-gray-700 mb-1">
			No forms matching &quot;{query}&quot;
		</p>
		<p className="text-sm text-gray-400 mb-4">
			Check your spelling or try searching for another name.
		</p>
		{onClearSearch && (
			<button
				type="button"
				onClick={onClearSearch}
				className="px-4 py-1.5 bg-[#673ab7] text-white text-xs font-medium rounded-full hover:bg-[#5a2ea6] transition duration-150"
			>
				Clear search
			</button>
		)}
	</div>
);

EmptySearchState.propTypes = {
	query: PropTypes.string,
	onClearSearch: PropTypes.func,
};

const EmptyStarredState = () => (
	<div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
		<p className="text-base font-medium text-gray-700 mb-1">No starred forms</p>
		<p className="text-sm text-gray-400">
			Star your favorite forms to access them quickly here.
		</p>
	</div>
);

const EmptyState = () => (
	<div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
		<p className="text-base font-medium text-gray-700 mb-1">No forms yet</p>
		<p className="text-sm text-gray-400">
			Click on &quot;Blank form&quot; above to create your first Google Form!
		</p>
	</div>
);

export default RecentForms;
