import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useCreateFormMutation } from "../../redux/api/formApi";
import BlankFormCard from "./templates/BlankFormCard";
import TemplateCard from "./templates/TemplateCard";
import AIGeneratorCard from "./templates/AIGeneratorCard";
import { TEMPLATES } from "./templates/templatesData";

const BlankForm = () => {
	const navigate = useNavigate();
	const { isAuthenticated } = useAuth();
	const [createForm, { isLoading: isCreating }] = useCreateFormMutation();

	const handleOpenTemplate = async (template) => {
		if (isCreating) return;

		const formPayload = {
			name: template.name,
			title: template.title,
			description: template.description,
			headerImage: "",
			items: template.items,
		};

		if (isAuthenticated) {
			try {
				const res = await createForm(formPayload).unwrap();
				const newId = res?._id || res?.data?._id;
				if (newId) {
					navigate(`/forms/${newId}/edit`);
				}
			} catch (err) {
				console.error("Failed to create template form:", err);
				localStorage.setItem(
					"google_form_draft",
					JSON.stringify(formPayload)
				);
				navigate("/forms/create");
			}
		} else {
			localStorage.setItem(
				"google_form_draft",
				JSON.stringify(formPayload)
			);
			navigate("/forms/create");
		}
	};

	return (
		<section className="bg-[#e4e7ea] py-6">
			<div className="max-w-[780px] mx-auto px-4">
				<p className="text-base font-normal text-[#202124] mb-3">
					Start a new form
				</p>

				<div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
					{/* 1. Blank Form */}
					<BlankFormCard />

					{/* 2. Built-in Templates */}
					{TEMPLATES.map((template) => (
						<TemplateCard
							key={template.id}
							template={template}
							onSelect={handleOpenTemplate}
						/>
					))}

					{/* 3. ✨ Generate with AI Card - Opens editor with AI modal */}
					<AIGeneratorCard
						onOpenModal={() => navigate("/forms/create?ai=true")}
					/>
				</div>
			</div>
		</section>
	);
};

export default BlankForm;
