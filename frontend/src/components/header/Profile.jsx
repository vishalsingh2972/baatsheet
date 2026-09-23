import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineUser, HiOutlineLogout } from "react-icons/hi";
import useAuth from "../../hooks/useAuth";

const Profile = () => {
	const { user, isAuthenticated, signOut } = useAuth();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);
	const navigate = useNavigate();

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleLogout = () => {
		signOut();
		setIsOpen(false);
		navigate("/login");
	};

	const displayName =
		user?.name && user.name.trim() !== ""
			? user.name
			: user?.email
				? user.email.split("@")[0]
				: "User";

	const initial = displayName.charAt(0).toUpperCase();

	return (
		<div className="flex items-center gap-2.5">
			{!isAuthenticated && (
				<button
					type="button"
					onClick={() => setIsOpen((prev) => !prev)}
					className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#673ab7]/10 text-[#673ab7] border border-[#673ab7]/20 hover:bg-[#673ab7]/20 transition duration-150 cursor-pointer focus:outline-none"
				>
					Demo Mode
				</button>
			)}

			<div className="relative" ref={dropdownRef}>
				<button
					type="button"
					onClick={() => setIsOpen(!isOpen)}
					className="p-1 hover:bg-slate-100 rounded-full cursor-pointer flex items-center gap-2 focus:outline-none transition duration-150"
					title={
						isAuthenticated ? displayName : "Guest User (Demo Mode)"
					}
				>
					{isAuthenticated ? (
						<div className="w-8 h-8 rounded-full bg-[#673ab7] text-white font-semibold flex items-center justify-center text-sm shadow-sm transition duration-150 hover:opacity-90">
							{initial}
						</div>
					) : (
						<div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-base shadow-xs transition duration-150 hover:bg-gray-300">
							<HiOutlineUser />
						</div>
					)}
				</button>

				{isOpen && (
					<div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 px-4 z-50 animate-fadeIn">
						{isAuthenticated ? (
							<>
								<div className="flex items-center gap-3 pb-3 border-b border-gray-100">
									<div className="w-10 h-10 rounded-full bg-[#673ab7] text-white font-bold flex items-center justify-center text-base shadow-sm">
										{initial}
									</div>
									<div className="overflow-hidden">
										<p className="text-sm font-semibold text-gray-900 truncate">
											{displayName}
										</p>
										<p className="text-xs text-gray-500 truncate">
											{user?.email}
										</p>
									</div>
								</div>

								<div className="pt-2">
									<button
										type="button"
										onClick={handleLogout}
										className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-xl transition duration-150 cursor-pointer"
									>
										<HiOutlineLogout className="text-base text-red-600" />
										<span>Sign Out</span>
									</button>
								</div>
							</>
						) : (
							<>
								<div className="flex items-center gap-3 pb-3 border-b border-gray-100">
									<div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-lg shadow-xs">
										<HiOutlineUser />
									</div>
									<div>
										<p className="text-sm font-semibold text-gray-900">
											Guest User
										</p>

										<p className="text-xs text-gray-400">
											Not signed in
										</p>
									</div>
								</div>

								<p className="py-2.5 text-xs text-gray-500 leading-relaxed">
									Sign in to save your forms, bookmark with
									stars, and collect live responses.
								</p>

								<div className="flex flex-col gap-1.5 pt-1">
									<Link
										to="/login"
										onClick={() => setIsOpen(false)}
										className="w-full inline-flex items-center justify-center py-2 px-3 bg-[#673ab7] hover:bg-[#5a2ea6] text-white text-xs font-semibold rounded-lg shadow-xs transition duration-150"
									>
										Sign In
									</Link>
									<Link
										to="/register"
										onClick={() => setIsOpen(false)}
										className="w-full text-center py-1 text-xs text-[#673ab7] hover:underline font-medium"
									>
										Create an account
									</Link>
								</div>
							</>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default Profile;
