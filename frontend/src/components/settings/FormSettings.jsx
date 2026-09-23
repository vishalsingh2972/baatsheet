import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { MdCheck } from "react-icons/md";
import { useGetFormByIdQuery, useUpdateFormMutation } from "../../redux/api/formApi";
import ResponsesSettingsCard from "./cards/ResponsesSettingsCard";
import DeadlinesSettingsCard from "./cards/DeadlinesSettingsCard";
import PresentationSettingsCard from "./cards/PresentationSettingsCard";

const FormSettings = ({ formId }) => {
	const { data: form, isLoading } = useGetFormByIdQuery(formId, {
		skip: !formId,
	});
	const [updateForm] = useUpdateFormMutation();

	// Local settings state
	const [settings, setSettings] = useState({
		collectEmail: "none",
		limitOneResponse: false,
		deadline: "",
		isAcceptingResponses: true,
		closedFormMessage: "This form is no longer accepting responses.",
		confirmationMessage: "Your response has been recorded.",
		showSubmitAnotherLink: true,
	});

	// Expanded sections state
	const [expanded, setExpanded] = useState({
		responses: true,
		deadlines: true,
		presentation: true,
	});

	const [saveFeedback, setSaveFeedback] = useState(false);

	useEffect(() => {
		if (form?.settings) {
			let formattedDeadline = "";
			if (form.settings.deadline) {
				const d = new Date(form.settings.deadline);
				if (!isNaN(d.getTime())) {
					// Format to YYYY-MM-DDTHH:MM for datetime-local input
					const offset = d.getTimezoneOffset() * 60000;
					formattedDeadline = new Date(d.getTime() - offset).toISOString().slice(0, 16);
				}
			}

			setSettings({
				collectEmail: form.settings.collectEmail || "none",
				limitOneResponse: form.settings.limitOneResponse || false,
				deadline: formattedDeadline,
				isAcceptingResponses: form.settings.isAcceptingResponses !== false,
				closedFormMessage: form.settings.closedFormMessage || "This form is no longer accepting responses.",
				confirmationMessage: form.settings.confirmationMessage || "Your response has been recorded.",
				showSubmitAnotherLink: form.settings.showSubmitAnotherLink !== false,
			});
		}
	}, [form]);

	const toggleSection = (key) => {
		setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const handleSettingChange = async (key, value) => {
		const updated = { ...settings, [key]: value };
		setSettings(updated);

		if (!formId) return;

		try {
			const payloadDeadline = updated.deadline ? new Date(updated.deadline).toISOString() : null;

			await updateForm({
				id: formId,
				settings: {
					...updated,
					deadline: payloadDeadline,
				},
			}).unwrap();

			setSaveFeedback(true);
			setTimeout(() => setSaveFeedback(false), 2000);
		} catch (err) {
			console.error("Failed to update form settings:", err);
		}
	};

	if (isLoading) {
		return (
			<div className="w-full h-full flex items-center justify-center pt-32">
				<div className="w-10 h-10 border-4 border-[#673ab7] border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	return (
		<main className="w-full h-full flex flex-col items-center pt-28 pb-24 overflow-y-scroll scroll-smooth">
			<div className="w-[780px] flex flex-col gap-4">
				{/* Settings Saved Feedback Toast */}
				{saveFeedback && (
					<div className="fixed bottom-6 left-6 z-50 bg-[#202124] text-white text-xs py-2 px-4 rounded shadow-lg flex items-center gap-2 animate-fade-in">
						<MdCheck className="text-green-400 text-base" />
						<span>Settings saved</span>
					</div>
				)}

				{/* 1. Responses Settings Card */}
				<ResponsesSettingsCard
					isExpanded={expanded.responses}
					onToggle={() => toggleSection("responses")}
					collectEmail={settings.collectEmail}
					limitOneResponse={settings.limitOneResponse}
					onSettingChange={handleSettingChange}
				/>

				{/* 2. Deadlines & Form Status Card */}
				<DeadlinesSettingsCard
					isExpanded={expanded.deadlines}
					onToggle={() => toggleSection("deadlines")}
					isAcceptingResponses={settings.isAcceptingResponses}
					deadline={settings.deadline}
					closedFormMessage={settings.closedFormMessage}
					onSettingChange={handleSettingChange}
				/>

				{/* 3. Presentation Settings Card */}
				<PresentationSettingsCard
					isExpanded={expanded.presentation}
					onToggle={() => toggleSection("presentation")}
					confirmationMessage={settings.confirmationMessage}
					showSubmitAnotherLink={settings.showSubmitAnotherLink}
					onSettingChange={handleSettingChange}
				/>
			</div>
		</main>
	);
};

FormSettings.propTypes = {
	formId: PropTypes.string,
};

export default FormSettings;
