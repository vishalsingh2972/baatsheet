import { Link } from "react-router-dom";

const TryDemoLink = () => {
	return (
		<>
			{/* Divider */}
			<div className="relative flex py-5 items-center">
				<div className="flex-grow border-t border-gray-200" />
				<span className="flex-shrink mx-4 text-gray-400 text-xs uppercase tracking-wider select-none">
					or
				</span>
				<div className="flex-grow border-t border-gray-200" />
			</div>

			{/* Try Demo Link */}
			<div className="text-center">
				<Link
					to="/"
					className="inline-flex items-center gap-1.5 text-sm text-[#5f6368] hover:text-[#673ab7] font-medium transition duration-150 group"
				>
					<span>Explore without signing in</span>
					<span className="group-hover:translate-x-1 transition-transform duration-150">
						→
					</span>
				</Link>
			</div>
		</>
	);
};

export default TryDemoLink;
