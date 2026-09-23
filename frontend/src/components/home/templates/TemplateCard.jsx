import PropTypes from "prop-types";

const TemplateCard = ({ template, onSelect }) => {
	const isContact = template.id === "contact";

	return (
		<div
			onClick={() => onSelect(template)}
			className="w-[171px] cursor-pointer group flex-shrink-0"
		>
			<div className="w-[171px] h-[128px] rounded bg-white border border-[#DADCE0] group-hover:border-violet-500 transition shadow-2xs group-hover:shadow-md overflow-hidden flex flex-col">
				{/* Top Accent Strip */}
				<div className={`h-[36px] ${template.headerColor || "bg-[#673ab7]"} w-full flex items-center px-3`}>
					<div className="w-12 h-2 bg-white/80 rounded-xs" />
				</div>

				{/* Mockup Lines */}
				<div className="p-2.5 flex flex-col gap-1.5 flex-1 bg-[#FAFAFA]">
					<div className="w-full h-2 bg-slate-200 rounded-xs" />
					{isContact ? (
						<>
							<div className="w-3/4 h-1.5 bg-slate-200 rounded-xs mb-1" />
							<div className="flex items-center gap-1.5">
								<div className="w-2 h-2 rounded-full border border-slate-300" />
								<div className="w-16 h-1.5 bg-slate-200 rounded-xs" />
							</div>
							<div className="flex items-center gap-1.5">
								<div className="w-2 h-2 rounded-full border border-slate-300" />
								<div className="w-12 h-1.5 bg-slate-200 rounded-xs" />
							</div>
						</>
					) : (
						<>
							<div className="flex items-center gap-1.5 my-0.5">
								<div className="w-2 h-2 rounded-xs border border-slate-300" />
								<div className="w-20 h-1.5 bg-slate-200 rounded-xs" />
							</div>
							<div className="flex items-center gap-1.5">
								<div className="w-2 h-2 rounded-xs border border-slate-300" />
								<div className="w-14 h-1.5 bg-slate-200 rounded-xs" />
							</div>
							<div className="w-2/3 h-1.5 bg-slate-200 rounded-xs mt-1" />
						</>
					)}
				</div>
			</div>
			<p className="text-sm font-medium text-[#202124] mt-2 group-hover:text-violet-600 transition truncate text-center w-full">
				{template.name}
			</p>
		</div>
	);
};

TemplateCard.propTypes = {
	template: PropTypes.shape({
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		title: PropTypes.string,
		headerColor: PropTypes.string,
		description: PropTypes.string,
		items: PropTypes.array,
	}).isRequired,
	onSelect: PropTypes.func.isRequired,
};

export default TemplateCard;
