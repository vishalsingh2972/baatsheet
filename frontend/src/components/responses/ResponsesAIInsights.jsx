import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSummarizeResponsesWithAIMutation } from "../../redux/api/formApi";
import AIInsightsInitialBanner from "./aiInsights/AIInsightsInitialBanner";
import AIInsightsLoadingView from "./aiInsights/AIInsightsLoadingView";
import AIInsightsHeader from "./aiInsights/AIInsightsHeader";
import AIExecutiveSummaryCard from "./aiInsights/AIExecutiveSummaryCard";
import AISentimentBreakdown from "./aiInsights/AISentimentBreakdown";
import AIThemesAndRecommendations from "./aiInsights/AIThemesAndRecommendations";

const ResponsesAIInsights = ({ formId, formTitle, questions = [], responses = [] }) => {
	const totalResponses = responses.length;
	const storageKey = formId ? `gf_ai_insights_${formId}` : null;

	const [isExpanded, setIsExpanded] = useState(true);
	const [insightsData, setInsightsData] = useState(() => {
		if (!storageKey) return null;
		try {
			const saved = localStorage.getItem(storageKey);
			return saved ? JSON.parse(saved) : null;
		} catch {
			return null;
		}
	});

	const [copied, setCopied] = useState(false);
	const [error, setError] = useState("");

	const [summarizeResponsesWithAI, { isLoading }] =
		useSummarizeResponsesWithAIMutation();

	// If formId changes, load saved insights for that form
	useEffect(() => {
		if (storageKey) {
			try {
				const saved = localStorage.getItem(storageKey);
				setInsightsData(saved ? JSON.parse(saved) : null);
			} catch {
				setInsightsData(null);
			}
		}
	}, [storageKey]);

	const handleGenerateInsights = async () => {
		if (totalResponses === 0) return;
		setError("");
		try {
			const res = await summarizeResponsesWithAI({
				formTitle: formTitle || "Untitled Form",
				questions: questions || [],
				responses: responses || [],
			}).unwrap();

			const data = res?.data || res;
			if (data && data.executiveSummary) {
				setInsightsData(data);
				setIsExpanded(true);
				if (storageKey) {
					try {
						localStorage.setItem(storageKey, JSON.stringify(data));
					} catch (e) {
						console.warn("Failed to persist insights to localStorage:", e);
					}
				}
			} else {
				setError("Unable to generate insights. Please try again.");
			}
		} catch (err) {
			console.error("AI Responses Summary failed:", err);
			setError(
				err?.data?.message ||
					"Failed to generate AI insights. Please try again."
			);
		}
	};

	const handleCopy = () => {
		if (!insightsData) return;
		const text = `📊 AI Responses Summary for: ${formTitle || "Form"} (${
			insightsData.responseCount || totalResponses
		} responses)

📌 Executive Summary:
${insightsData.executiveSummary}

🎭 Sentiment:
- Positive: ${insightsData.sentiment?.positive || 0}%
- Neutral: ${insightsData.sentiment?.neutral || 0}%
- Negative: ${insightsData.sentiment?.negative || 0}%

🔍 Key Themes:
${(insightsData.keyThemes || []).map((t) => `• ${t}`).join("\n")}

💡 Recommendations:
${(insightsData.recommendations || []).map((r) => `• ${r}`).join("\n")}`;

		navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	if (totalResponses === 0) return null;

	// 1. Initial State Banner (Not generated yet)
	if (!insightsData && !isLoading) {
		return (
			<AIInsightsInitialBanner
				totalResponses={totalResponses}
				onGenerate={handleGenerateInsights}
			/>
		);
	}

	// 2. Loading State
	if (isLoading) {
		return <AIInsightsLoadingView totalResponses={totalResponses} />;
	}

	// 3. Generated Insights Dashboard Card
	return (
		<div className="w-full bg-white border border-purple-100/90 rounded-2xl shadow-xs overflow-hidden mb-6 transition-all">
			<AIInsightsHeader
				responseCount={insightsData.responseCount}
				totalResponses={totalResponses}
				copied={copied}
				isExpanded={isExpanded}
				onCopy={handleCopy}
				onRefresh={handleGenerateInsights}
				onToggleExpand={() => setIsExpanded((prev) => !prev)}
			/>

			{isExpanded && (
				<div className="p-5 space-y-4 animate-fade-in">
					<AIExecutiveSummaryCard
						summaryText={insightsData.executiveSummary}
					/>

					<AISentimentBreakdown sentiment={insightsData.sentiment} />

					<AIThemesAndRecommendations
						keyThemes={insightsData.keyThemes}
						recommendations={insightsData.recommendations}
					/>

					{error && (
						<p className="text-xs text-red-500 font-medium">{error}</p>
					)}
				</div>
			)}
		</div>
	);
};

ResponsesAIInsights.propTypes = {
	formId: PropTypes.string,
	formTitle: PropTypes.string,
	questions: PropTypes.arrayOf(PropTypes.object),
	responses: PropTypes.arrayOf(PropTypes.object),
};

export default ResponsesAIInsights;
