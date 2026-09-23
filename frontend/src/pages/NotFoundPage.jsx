import { Link, useNavigate } from "react-router-dom";
import { HiOutlineArrowLeft, HiOutlineHome } from "react-icons/hi";
import form_logo from "../assets/form-logo.png";

const NotFoundPage = () => {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-[#F0EBF8] flex flex-col items-center justify-center px-4 py-12">
			<div className="w-full max-w-[540px] bg-white rounded-[24px] shadow-xl border border-gray-100 p-8 md:p-12 text-center flex flex-col items-center animate-fadeIn">
				{/* Google Forms Logo */}
				<div className="flex items-center gap-3 mb-6">
					<img
						src={form_logo}
						alt="Google Forms Logo"
						className="w-10 h-10 object-contain"
					/>
					<span className="text-xl font-medium text-gray-700">
						Google Forms
					</span>
				</div>

				{/* 404 Badge */}
				<div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#673ab7]/10 text-[#673ab7] font-bold text-sm mb-4">
					404 ERROR
				</div>

				<h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
					Page Not Found
				</h1>

				<p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8 max-w-[420px]">
					The form, response, or page you are looking for doesn&apos;t
					exist, has been removed, or is temporarily unavailable.
				</p>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
					<Link
						to="/"
						className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#673ab7] hover:bg-[#5a2ea6] text-white font-medium rounded-xl shadow-md transition duration-150 text-sm"
					>
						<HiOutlineHome className="text-lg" />
						<span>Back to Home</span>
					</Link>

					<button
						type="button"
						onClick={() => navigate(-1)}
						className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 font-medium rounded-xl transition duration-150 text-sm"
					>
						<HiOutlineArrowLeft className="text-lg" />
						<span>Go Back</span>
					</button>
				</div>
			</div>

			<p className="text-xs text-gray-400 mt-8">
				&copy; {new Date().getFullYear()} Google Forms Clone
			</p>
		</div>
	);
};

export default NotFoundPage;
