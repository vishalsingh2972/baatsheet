import { Link } from "react-router-dom";

const ResponsesAuthPrompt = () => {
	return (
		<main className="w-full h-full flex flex-col items-center pt-28 pb-20 overflow-y-scroll scroll-smooth">
			<div className="w-full max-w-[780px] px-4">
				<div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-200 text-center">
					<div className="w-16 h-16 bg-[#673ab7]/10 text-[#673ab7] rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
						0
					</div>
					<h3 className="text-xl font-bold text-gray-900 mb-2">
						Sign in to view responses
					</h3>
					<p className="text-sm text-gray-500 max-w-[420px] mx-auto mb-6 leading-relaxed">
						Responses are collected and stored securely for
						registered users. Sign in or create an account to save
						your form and track submissions.
					</p>
					<Link
						to="/login"
						className="inline-flex items-center justify-center px-6 py-2.5 bg-[#673ab7] hover:bg-[#5a2ea6] text-white text-sm font-medium rounded-xl shadow-sm transition duration-150"
					>
						Sign In
					</Link>
				</div>
			</div>
		</main>
	);
};

export default ResponsesAuthPrompt;
