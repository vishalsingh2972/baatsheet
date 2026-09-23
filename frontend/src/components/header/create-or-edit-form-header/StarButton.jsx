import { useState } from "react";
import PropTypes from "prop-types";
import { IoMdStar, IoMdStarOutline } from "react-icons/io";
import useAuth from "../../../hooks/useAuth";
import AuthPromptModal from "../../modals/AuthPromptModal";
import { useToggleFormStarMutation } from "../../../redux/api/formApi";

const StarButton = ({ formId, isStarred = false }) => {
	const { isAuthenticated } = useAuth();
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [toggleFormStar, { isLoading }] = useToggleFormStarMutation();

	const handleClick = async () => {
		if (!isAuthenticated) {
			setShowAuthModal(true);
			return;
		}

		if (!formId || isLoading) return;

		try {
			await toggleFormStar({ id: formId, isStarred: !isStarred }).unwrap();
		} catch (err) {
			console.error("Failed to toggle star:", err);
		}
	};

	return (
		<>
			<button
				type="button"
				onClick={handleClick}
				disabled={isLoading}
				className="p-1 rounded-full hover:bg-slate-100 cursor-pointer focus:outline-none transition duration-150"
				title={isStarred ? "Unstar form" : "Star form"}
			>
				{isStarred ? (
					<IoMdStar color="#5f6368" fontSize="1.5em" />
				) : (
					<IoMdStarOutline color="#5f6368" fontSize="1.5em" />
				)}
			</button>

			<AuthPromptModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
				title="Sign in to star forms"
				message="Sign in to bookmark this form and access it quickly from your starred forms."
			/>
		</>
	);
};

StarButton.propTypes = {
	formId: PropTypes.string,
	isStarred: PropTypes.bool,
};

export default StarButton;
