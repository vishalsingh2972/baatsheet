import PropTypes from "prop-types";
import { MdExpandMore } from "react-icons/md";

const SettingsCard = ({
	icon: Icon,
	title,
	description,
	isExpanded,
	onToggle,
	children,
}) => {
	return (
		<div className="w-full bg-white rounded-lg border border-[#DADCE0] shadow-sm overflow-hidden">
			<div
				onClick={onToggle}
				className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 transition duration-150 select-none"
			>
				<div className="flex items-center gap-3">
					<Icon className="text-xl text-[#5f6368]" />
					<div>
						<h2 className="text-base font-medium text-[#202124]">
							{title}
						</h2>
						<p className="text-xs text-[#5f6368]">{description}</p>
					</div>
				</div>
				<MdExpandMore
					className={`text-2xl text-[#5f6368] transition-transform duration-200 ${
						isExpanded ? "rotate-180" : ""
					}`}
				/>
			</div>

			{isExpanded && (
				<div className="border-t border-[#DADCE0] px-6 py-4 flex flex-col gap-6">
					{children}
				</div>
			)}
		</div>
	);
};

SettingsCard.propTypes = {
	icon: PropTypes.elementType.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	isExpanded: PropTypes.bool.isRequired,
	onToggle: PropTypes.func.isRequired,
	children: PropTypes.node.isRequired,
};

export default SettingsCard;
