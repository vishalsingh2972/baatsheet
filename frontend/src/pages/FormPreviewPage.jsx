import { useParams } from "react-router-dom";
import { useGetFormByIdQuery } from "../redux/api/formApi";
import PreviewHeader from "../components/preview/PreviewHeader";
import PreviewFormCanvas from "../components/preview/PreviewFormCanvas";

const FormPreviewPage = () => {
	const { id } = useParams();
	const { data: form, isLoading, isError } = useGetFormByIdQuery(id, {
		skip: !id,
	});

	if (isLoading) {
		return (
			<div className="w-full min-h-screen bg-[#f0ebf8] flex items-center justify-center">
				<div className="w-10 h-10 border-4 border-[#673ab7] border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	if (isError || !form) {
		return (
			<div className="w-full min-h-screen bg-[#f0ebf8] flex flex-col items-center justify-center p-4">
				<div className="bg-white p-8 rounded-xl shadow-sm max-w-md text-center">
					<h2 className="text-xl font-medium text-red-500 mb-2">
						Form Not Found
					</h2>
					<p className="text-sm text-gray-500 mb-6">
						The form you are trying to preview does not exist or may have been deleted.
					</p>
					<button
						type="button"
						onClick={() => window.close()}
						className="px-5 py-2 bg-[#673ab7] text-white text-sm font-medium rounded-lg hover:bg-[#5a2ea6] transition duration-150"
					>
						Close
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full min-h-screen bg-[#f0ebf8] flex flex-col">
			<PreviewHeader
				formName={form.name || form.title || "Untitled form"}
				formId={id}
			/>

			<main className="flex-1 overflow-y-auto pb-16">
				<PreviewFormCanvas form={form} />
			</main>
		</div>
	);
};

export default FormPreviewPage;
