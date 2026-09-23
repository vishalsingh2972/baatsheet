import { Link } from "react-router-dom";
import blank_form from "../../../assets/forms-blank-googlecolors.png";

const BlankFormCard = () => {
	return (
		<div className="w-[171px] cursor-pointer group flex-shrink-0">
			<Link to="/forms/create">
				<div className="w-[171px] h-[128px] rounded overflow-hidden border border-[#DADCE0] group-hover:border-violet-500 transition shadow-2xs group-hover:shadow-md bg-white">
					<img
						src={blank_form}
						alt="Blank form"
						className="w-full h-full object-cover"
					/>
				</div>
			</Link>
			<p className="text-sm font-medium text-[#202124] mt-2 group-hover:text-violet-600 transition truncate text-center w-full">
				Blank form
			</p>
		</div>
	);
};

export default BlankFormCard;
