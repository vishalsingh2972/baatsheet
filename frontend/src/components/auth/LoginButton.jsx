import googleIcon from "../../assets/authicons/google.svg";

const LoginButton = () => {
	return (
		<div className="flex items-center justify-between gap-[13px] md:gap-5">
			<div className="flex items-center justify-center w-full h-[38px] md:h-[52px] bg-[#4E5D78]/[0.05] cursor-pointer rounded-[10px]">
				<img src={googleIcon} alt="google icon" />
				<p className="roboto-medium text-[#4E5D78] text-xs md:text-base ml-2 md:ml-6">
					Log in with Google
				</p>
			</div>
		</div>
	);
};

export default LoginButton;
