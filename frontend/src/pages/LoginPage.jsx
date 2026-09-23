import { Link, useSearchParams } from "react-router-dom";
import SubTitle from "../components/auth/SubTitle";
import Title from "../components/auth/Title";
import LoginForm from "../components/auth/LoginForm";
import TryDemoLink from "../components/auth/TryDemoLink";

const LoginPage = () => {
	const [searchParams] = useSearchParams();
	const redirectParam = searchParams.get("redirect");

	const registerLink = redirectParam
		? `/register?redirect=${encodeURIComponent(redirectParam)}`
		: "/register";

	return (
		<section className="bg-gradient-to-br from-[#FFFFFF]/40 to-[#FFFFFF]/10 pb-[88px]">
			{/* title of the login screen */}
			<div className="text-center mt-[30px]">
				<Title text="Sign In" />
				<div className="w-2/3 mx-auto mt-[10px]">
					<SubTitle text="Welcome back, you've been missed!" />
				</div>
			</div>

			{/* sign-in card */}
			<div className="w-[327px] md:w-[580px] py-6 px-5 md:p-10 mx-auto shadow-[0_5px_20px_-15px_rgba(0,0,0,0.3)] bg-white mt-7 rounded-[20px]">
				{/* sign-in form */}
				<LoginForm />

				<div className="flex items-center justify-center text-center roboto-medium text-xs md:text-base">
					<p className="text-[#4E5D78]">
						{"You haven't any account?"}
					</p>
					<Link
						to={registerLink}
						className="text-[#673ab7] hover:text-[#5a2ea6] hover:underline ml-[6px] md:ml-[19px] font-medium"
					>
						Sign Up
					</Link>
				</div>

				{/* Shared Try Demo Section */}
				<TryDemoLink />
			</div>
		</section>
	);
};

export default LoginPage;
