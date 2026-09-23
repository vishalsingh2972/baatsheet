import { useParams } from "react-router-dom";
import { useGetFormByIdQuery } from "../redux/api/formApi";
import PreviewFormCanvas from "../components/preview/PreviewFormCanvas";

const FormViewPage = () => {
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
						The form you are looking for does not exist or may have been deleted.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full min-h-screen bg-[#f0ebf8] flex flex-col">
			<main className="flex-1 overflow-y-auto pb-16">
				<PreviewFormCanvas form={form} mode="view" />
			</main>
		</div>
	);
};

export default FormViewPage;
