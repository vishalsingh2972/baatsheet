import { useState } from "react";
import at from "../../assets/authicons/at.svg";
import lock from "../../assets/authicons/lock.svg";
import eye_on from "../../assets/authicons/eye-on.svg";
import eye_off from "../../assets/authicons/eye-off.svg";
import useAuth from "../../hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";

const LoginForm = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { signIn, isLoading } = useAuth();
	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm();

	const submitForm = async (formData) => {
		const { email, password } = formData;

		try {
			await signIn(email, password);
			const redirectParam = searchParams.get("redirect");
			const hasDraft = localStorage.getItem("google_form_draft");

			if (redirectParam) {
				navigate(redirectParam);
			} else if (hasDraft) {
				navigate("/forms/create");
			} else {
				navigate("/");
			}
		} catch (error) {
			const errorMsg =
				error?.data?.message ||
				error?.message ||
				`User with email ${email} was not found or password is incorrect.`;
			setError("root.random", {
				type: "manual",
				message: errorMsg,
			});
		}
	};

	return (
		<form onSubmit={handleSubmit(submitForm)}>
			<div
				className={`relative ${
					errors?.email?.message ? "mb-1" : "my-[14px] md:my-5"
				}`}
			>
				<input
					{...register("email", { required: "Email ID is Required" })}
					type="email"
					id="email"
					name="email"
					placeholder="Your Email"
					className={`relative w-full h-10 md:h-[52px] pl-[34px] md:pl-11 border ${
						errors?.email
							? "border-[#FF5630] "
							: "border-[#4E5D78]/20 "
					} rounded-md md:rounded-[10px] focus:outline-none focus:border-[#673ab7] placeholder-[#4E5D78]/60`}
				/>
				<img
					src={at}
					alt="at"
					className="absolute top-0 bottom-0 my-auto left-[10px] md:left-4 peer-disabled:cursor-not-allowed"
				/>
			</div>

			{errors?.email && (
				<div role="alert" className="text-[#FF5630] text-sm mb-2">
					{errors?.email?.message}
				</div>
			)}

			<div
				className={`relative ${
					errors?.password?.message ? "mb-1" : "my-[14px] md:my-5"
				}`}
			>
				<input
					{...register("password", {
						required: "Password is required",
						minLength: {
							value: 6,
							message: "Your password must be at least 6 characters",
						},
					})}
					type={showPassword ? "text" : "password"}
					id="password"
					name="password"
					placeholder="Enter Password"
					className={`relative w-full h-10 md:h-[52px] pl-[34px] md:pl-11 pr-[34px] md:pr-11 border ${
						errors?.password
							? "border-[#FF5630] "
							: "border-[#4E5D78]/20 "
					} rounded-md md:rounded-[10px] focus:outline-none focus:border-[#673ab7] placeholder-[#4E5D78]/60`}
				/>

				<img
					src={lock}
					alt="password icon"
					className="absolute top-0 bottom-0 my-auto left-[10px] md:left-4 peer-disabled:cursor-not-allowed"
				/>

				<button
					type="button"
					onClick={() => setShowPassword((prev) => !prev)}
					className="absolute top-0 bottom-0 my-auto right-[10px] md:right-4 focus:outline-none"
				>
					<img
						src={showPassword ? eye_on : eye_off}
						alt="toggle password visibility"
						className="w-5 h-5 opacity-60 hover:opacity-100"
					/>
				</button>
			</div>

			{errors?.password && (
				<div role="alert" className="text-[#FF5630] text-sm mb-2">
					{errors?.password?.message}
				</div>
			)}

			{errors?.root?.random && (
				<p role="alert" className="text-[#FF5630] text-sm my-2 text-center">
					{errors?.root?.random?.message}
				</p>
			)}

			<button
				type="submit"
				disabled={isLoading}
				className="inline-flex items-center justify-center w-full h-10 md:h-[52px] bg-[#673ab7] text-white rounded-[10px] my-5 md:my-[30px] font-medium transition duration-200 hover:bg-[#5a2ea6] disabled:opacity-50 shadow-md"
			>
				<span>{isLoading ? "Signing In..." : "Sign In"}</span>
			</button>
		</form>
	);
};

export default LoginForm;
