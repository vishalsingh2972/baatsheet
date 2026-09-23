import PropTypes from "prop-types";
import AuthPromptModal from "../modals/AuthPromptModal";
import AIPromptModal from "../modals/AIPromptModal";
import AIQuestionModal from "../modals/AIQuestionModal";

const FormEditorModals = ({
	showAuthModal,
	onCloseAuthModal,
	isAIPromptModalOpen,
	onCloseAIPromptModal,
	onAISuccess,
	isAIQuestionModalOpen,
	onCloseAIQuestionModal,
	onInsertAIQuestions,
	onUpdateAIQuestion,
	onUpdateAIHeader,
	activeContext,
	formTitle,
}) => {
	return (
		<>
			{/* Modal prompting guests to sign in or register to persist forms */}
			<AuthPromptModal
				isOpen={showAuthModal}
				onClose={onCloseAuthModal}
				title="Sign in to save"
				message="Sign in or create an account to save this form and start collecting responses."
			/>

			{/* Full Form AI Generator Modal */}
			<AIPromptModal
				isOpen={isAIPromptModalOpen}
				onClose={onCloseAIPromptModal}
				onSuccess={onAISuccess}
			/>

			{/* Dual-Mode Modal for adding or editing questions with Gemini AI */}
			<AIQuestionModal
				isOpen={isAIQuestionModalOpen}
				onClose={onCloseAIQuestionModal}
				onInsertQuestions={onInsertAIQuestions}
				onUpdateQuestion={onUpdateAIQuestion}
				onUpdateHeader={onUpdateAIHeader}
				activeContext={activeContext}
				formTitle={formTitle}
			/>
		</>
	);
};

FormEditorModals.propTypes = {
	showAuthModal: PropTypes.bool.isRequired,
	onCloseAuthModal: PropTypes.func.isRequired,
	isAIPromptModalOpen: PropTypes.bool.isRequired,
	onCloseAIPromptModal: PropTypes.func.isRequired,
	onAISuccess: PropTypes.func.isRequired,
	isAIQuestionModalOpen: PropTypes.bool.isRequired,
	onCloseAIQuestionModal: PropTypes.func.isRequired,
	onInsertAIQuestions: PropTypes.func.isRequired,
	onUpdateAIQuestion: PropTypes.func.isRequired,
	onUpdateAIHeader: PropTypes.func.isRequired,
	activeContext: PropTypes.object,
	formTitle: PropTypes.string,
};

export default FormEditorModals;
