import PropTypes from "prop-types";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdStar, IoMdStarOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import form_logo from "../../../assets/form-logo.png";

const FormCard = ({ form, isMenuOpen, onMenuToggle, onStarToggle }) => {
	return (
		<div className="relative">
			<Link
				to={`/forms/${form._id}/edit`}
				className="flex items-center justify-between w-full h-14 rounded-xl cursor-pointer hover:bg-purple-50 px-4 transition duration-150 border border-transparent hover:border-purple-100"
			>
				{/* Left: icon + title */}
				<div className="flex items-center min-w-0">
					<img
						src={form_logo}
						alt="form icon"
						className="w-5 h-5 block rounded-sm mr-4 flex-shrink-0"
					/>
					<span className="text-[#202124] font-medium text-sm md:text-base truncate">
						{form.name || form.title || "Untitled form"}
					</span>
				</div>

				{/* Right: timestamp + star + 3-dot button */}
				<div className="flex items-center gap-3 flex-shrink-0">
					<span className="text-xs md:text-sm font-light text-[#5F6368]">
						{new Date(form.updatedAt).toLocaleDateString(undefined, {
							month: "short",
							day: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						})}
					</span>

					{/* Star / Bookmark button before 3-dot menu */}
					<button
						type="button"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							onStarToggle(form._id, !form.isStarred);
						}}
						className="p-1.5 rounded-full hover:bg-slate-200 cursor-pointer focus:outline-none transition duration-150"
						title={form.isStarred ? "Unstar form" : "Star form"}
					>
						{form.isStarred ? (
							<IoMdStar color="#5f6368" fontSize="1.35em" />
						) : (
							<IoMdStarOutline color="#5f6368" fontSize="1.35em" />
						)}
					</button>

					{/* 3-dot menu button with data-menu-trigger to prevent mousedown race condition */}
					<button
						type="button"
						data-menu-trigger="true"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							onMenuToggle(form._id);
						}}
						className={`p-2 rounded-full hover:bg-slate-200 cursor-pointer focus:outline-none transition duration-150 ${
							isMenuOpen ? "bg-slate-200" : ""
						}`}
					>
						<BsThreeDotsVertical fontSize="1.2em" color="#5f6368" />
					</button>
				</div>
			</Link>
		</div>
	);
};

FormCard.propTypes = {
	form: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		name: PropTypes.string,
		title: PropTypes.string,
		isStarred: PropTypes.bool,
		updatedAt: PropTypes.string,
	}).isRequired,
	isMenuOpen: PropTypes.bool,
	onMenuToggle: PropTypes.func.isRequired,
	onStarToggle: PropTypes.func.isRequired,
};

export default FormCard;
