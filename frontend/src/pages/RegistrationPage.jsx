import { Link, useSearchParams } from "react-router-dom";
import SubTitle from "../components/auth/SubTitle";
import Title from "../components/auth/Title";
import RegisterForm from "../components/auth/RegisterForm";
import TryDemoLink from "../components/auth/TryDemoLink";

const RegistrationPage = () => {
	const [searchParams] = useSearchParams();
	const redirectParam = searchParams.get("redirect");

	const loginLink = redirectParam
		? `/login?redirect=${encodeURIComponent(redirectParam)}`
		: "/login";

	return (
		<section className="bg-gradient-to-br from-[#FFFFFF]/40 to-[#FFFFFF]/10 pb-[88px]">
			{/* title of the sign-up screen */}
			<div className="text-center mt-[30px]">
				<Title text="Getting Started" />
				<div className="w-2/3 mx-auto mt-[10px]">
					<SubTitle text="Create an account to continue" />
				</div>
			</div>

			{/* sign-up card */}
			<div className="w-[327px] md:w-[580px] py-6 px-5 md:p-10 mx-auto shadow-[0_5px_20px_-15px_rgba(0,0,0,0.3)] bg-white mt-7 rounded-[20px]">
				{/* sign-up form */}
				<RegisterForm />

				<div className="flex items-center justify-center text-center roboto-medium text-xs md:text-base">
					<p className="text-[#4E5D78]">Already have an account?</p>
					<Link
						to={loginLink}
						className="text-[#673ab7] hover:text-[#5a2ea6] hover:underline ml-[6px] md:ml-[19px] font-medium"
					>
						Sign In
					</Link>
				</div>

				{/* Shared Try Demo Section */}
				<TryDemoLink />
			</div>
		</section>
	);
};

export default RegistrationPage;
