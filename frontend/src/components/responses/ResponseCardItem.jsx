import PropTypes from "prop-types";
import { MdExpandMore, MdExpandLess, MdOutlineEmail } from "react-icons/md";

const ResponseCardItem = ({ response, index, form, isExpanded, onToggle }) => {
	const createdAtFormatted = new Date(response.createdAt).toLocaleString(
		undefined,
		{
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		},
	);

	// Get a quick snippet from the first answered question
	const firstAnswer = response.answers?.[0]?.value;
	const firstAnswerSnippet = firstAnswer
		? Array.isArray(firstAnswer)
			? firstAnswer.join(", ")
			: String(firstAnswer)
		: "No answer";

	const answersCount = response.answers?.length || 0;
	const respondentEmail = response.respondentEmail;

	return (
		<div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 hover:border-purple-300">
			{/* Accordion Header Row (Clickable) */}
			<div
				onClick={onToggle}
				className="flex items-center justify-between p-4 md:p-5 cursor-pointer select-none hover:bg-purple-50/30 transition duration-150"
			>
				{/* Left: Badge, Email/Snippet, and Answer Count */}
				<div className="flex items-center gap-3.5 min-w-0 pr-2">
					<span className="flex-shrink-0 px-2.5 py-1 bg-purple-100 text-[#673ab7] rounded-lg text-xs font-semibold">
						#{index + 1}
					</span>

					<div className="min-w-0">
						{respondentEmail ? (
							<div className="flex items-center gap-1.5 truncate max-w-[200px] md:max-w-md">
								<MdOutlineEmail className="text-slate-400 text-sm flex-shrink-0" />
								<p className="text-sm font-semibold text-[#202124] truncate">
									{respondentEmail}
								</p>
							</div>
						) : (
							<p className="text-sm font-medium text-[#202124] truncate max-w-[200px] md:max-w-md">
								{firstAnswerSnippet}
							</p>
						)}

						<p className="text-xs text-gray-400 mt-0.5">
							{answersCount}{" "}
							{answersCount === 1 ? "answer" : "answers"}
							{respondentEmail && (
								<span className="text-gray-300 mx-1.5">•</span>
							)}
							{respondentEmail && (
								<span className="text-gray-500 truncate max-w-[140px] inline-block align-bottom">
									{firstAnswerSnippet}
								</span>
							)}
						</p>
					</div>
				</div>

				{/* Right: Timestamp + Expand Chevron */}
				<div className="flex items-center gap-3 flex-shrink-0 text-gray-500">
					<span className="text-xs font-normal text-gray-400 hidden sm:inline-block">
						{createdAtFormatted}
					</span>

					<div className="p-1 rounded-full hover:bg-gray-100 text-gray-600 transition">
						{isExpanded ? (
							<MdExpandLess fontSize="1.4em" />
						) : (
							<MdExpandMore fontSize="1.4em" />
						)}
					</div>
				</div>
			</div>

			{/* Expanded Detail Body */}
			{isExpanded && (
				<div className="p-4 md:p-6 bg-[#fafafa] border-t border-gray-100 flex flex-col gap-3.5 animate-fadeIn">
					<div className="flex items-center justify-between pb-2 border-b border-gray-200 text-xs text-gray-500">
						<span>Full Submission Details</span>
						<span className="sm:hidden">{createdAtFormatted}</span>
					</div>

					{/* Respondent Email Details Banner if recorded */}
					{respondentEmail && (
						<div className="bg-purple-50/70 p-3.5 rounded-xl border border-purple-100 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<MdOutlineEmail className="text-[#673ab7] text-base" />
								<span className="text-xs font-semibold text-slate-700">
									Respondent Email:
								</span>
							</div>
							<span className="text-xs font-bold text-[#673ab7] bg-white px-2.5 py-1 rounded-md border border-purple-100 shadow-2xs">
								{respondentEmail}
							</span>
						</div>
					)}

					{/* Answers List */}
					{response.answers && response.answers.length > 0 ? (
						response.answers.map((ans, aIdx) => {
							const questionItem = form?.items?.[ans.itemIndex];
							const questionTitle =
								questionItem?.questionTitle ||
								questionItem?.title ||
								`Question ${ans.itemIndex + 1}`;

							return (
								<div
									key={aIdx}
									className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs"
								>
									<p className="text-xs font-bold text-[#673ab7] uppercase tracking-wider mb-1.5">
										{questionTitle}
									</p>
									<div className="text-sm text-[#202124] leading-relaxed">
										{Array.isArray(ans.value) ? (
											<div className="flex flex-wrap gap-1.5 mt-1">
												{ans.value.map((v, vIdx) => (
													<span
														key={vIdx}
														className="px-2.5 py-1 bg-purple-50 text-[#673ab7] rounded-md text-xs font-medium border border-purple-100"
													>
														{v}
													</span>
												))}
											</div>
										) : (
											<p className="whitespace-pre-wrap">
												{String(ans.value || "—")}
											</p>
										)}
									</div>
								</div>
							);
						})
					) : (
						<p className="text-xs text-gray-400 italic">
							No answers recorded for this response.
						</p>
					)}
				</div>
			)}
		</div>
	);
};

ResponseCardItem.propTypes = {
	response: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		createdAt: PropTypes.string.isRequired,
		respondentEmail: PropTypes.string,
		answers: PropTypes.arrayOf(
			PropTypes.shape({
				itemIndex: PropTypes.number.isRequired,
				value: PropTypes.any,
			}),
		),
	}).isRequired,
	index: PropTypes.number.isRequired,
	form: PropTypes.object,
	isExpanded: PropTypes.bool.isRequired,
	onToggle: PropTypes.func.isRequired,
};

export default ResponseCardItem;
