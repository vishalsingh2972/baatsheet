import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { MdErrorOutline } from "react-icons/md";
import PreviewQuestionCard from "./PreviewQuestionCard";
import AuthPromptModal from "../modals/AuthPromptModal";
import useAuth from "../../hooks/useAuth";
import { useSubmitResponseMutation } from "../../redux/api/formApi";
import FormClosedView from "./canvas/FormClosedView";
import FormSubmittedView from "./canvas/FormSubmittedView";
import PreviewFormTitleCard from "./canvas/PreviewFormTitleCard";
import PreviewEmailCard from "./canvas/PreviewEmailCard";
import PreviewFormFooter from "./canvas/PreviewFormFooter";
import {
	validateFormResponses,
	scrollToFirstError,
	formatResponsePayload,
	getRespondentEmail,
} from "./utils/previewValidation";

const PreviewFormCanvas = ({ form, mode = "preview" }) => {
	const location = useLocation();
	const navigate = useNavigate();
	const { user, signOut, isLoading: isAuthLoading } = useAuth();

	const [answers, setAnswers] = useState({});
	const [respondentEmail, setRespondentEmail] = useState("");
	const [recordEmailChecked, setRecordEmailChecked] = useState(true);
	const [emailError, setEmailError] = useState(false);
	const [errors, setErrors] = useState({});
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [serverError, setServerError] = useState("");
	const [showAuthModal, setShowAuthModal] = useState(false);

	const [submitResponse, { isLoading: isSubmitting }] =
		useSubmitResponseMutation();

	const items = form?.items || [];
	const settings = form?.settings || {};
	const headerImage = form?.headerImage;
	const isViewMode = mode === "view";

	// Check if form requires authentication
	const requiresAuth =
		settings.collectEmail === "verified" ||
		settings.limitOneResponse === true;

	useEffect(() => {
		if (isViewMode && requiresAuth && !isAuthLoading && !user) {
			setShowAuthModal(true);
		} else {
			setShowAuthModal(false);
		}
	}, [isViewMode, requiresAuth, isAuthLoading, user]);

	// Pre-fill email if user is logged in
	useEffect(() => {
		if (user?.email && !respondentEmail) {
			setRespondentEmail(user.email);
		}
	}, [user, respondentEmail]);

	// Check if form is closed or past deadline
	const isManuallyClosed = settings.isAcceptingResponses === false;
	const isPastDeadline =
		settings.deadline &&
		!isNaN(new Date(settings.deadline).getTime()) &&
		new Date() > new Date(settings.deadline);
	const isClosed = isManuallyClosed || isPastDeadline;

	const handleSwitchAccount = async () => {
		try {
			await signOut();
		} catch (err) {
			console.error("Sign out error:", err);
		}
		const currentUrl = location.pathname + location.search;
		navigate(`/login?redirect=${encodeURIComponent(currentUrl)}`);
	};

	const handleAnswerChange = (index, value) => {
		setAnswers((prev) => ({ ...prev, [index]: value }));
		if (errors[index]) {
			setErrors((prev) => ({ ...prev, [index]: false }));
		}
	};

	const handleResetAnswers = () => {
		setAnswers({});
		setRespondentEmail(user?.email || "");
		setRecordEmailChecked(true);
		setErrors({});
		setEmailError(false);
		setServerError("");
		setIsSubmitted(false);
	};

	const handleClearForm = () => {
		if (window.confirm("Clear all your answers?")) {
			handleResetAnswers();
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!isViewMode || !form?._id) return;
		setServerError("");

		if (requiresAuth && !user) {
			setShowAuthModal(true);
			return;
		}

		// 1. Validate responses and email settings
		const validation = validateFormResponses({
			settings,
			recordEmailChecked,
			respondentEmail,
			items,
			answers,
		});

		if (!validation.isValid) {
			setEmailError(validation.emailError);
			setErrors(validation.questionErrors);
			scrollToFirstError(validation.firstInvalidTargetId);
			return;
		}

		// 2. Submit formatted payload
		try {
			await submitResponse({
				formId: form._id,
				respondentEmail: getRespondentEmail(settings, user, respondentEmail),
				answers: formatResponsePayload(answers),
			}).unwrap();
			setIsSubmitted(true);
		} catch (err) {
			console.error("Failed to submit form:", err);
			setServerError(
				err?.data?.message ||
					"Failed to submit form. Please check your responses and try again."
			);
		}
	};

	const redirectParam = encodeURIComponent(
		location.pathname + location.search
	);

	// 1. Closed / Expired Form View
	if (isClosed && isViewMode) {
		return (
			<FormClosedView
				headerImage={headerImage}
				title={form?.title}
				closedFormMessage={settings.closedFormMessage}
			/>
		);
	}

	// 2. Submitted Confirmation Screen
	if (isSubmitted) {
		return (
			<FormSubmittedView
				headerImage={headerImage}
				title={form?.title}
				confirmationMessage={settings.confirmationMessage}
				canSubmitAnother={
					settings.showSubmitAnotherLink !== false &&
					!settings.limitOneResponse
				}
				onReset={handleResetAnswers}
			/>
		);
	}

	// 3. Active Live Form Canvas
	return (
		<>
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-[770px] mx-auto px-4 pt-3 pb-8 md:pt-4 md:pb-12"
			>
				{/* Top Header Banner & Form Title Card */}
				<PreviewFormTitleCard
					headerImage={headerImage}
					title={form?.title}
					description={form?.description}
					user={user}
					onSwitchAccount={handleSwitchAccount}
					redirectParam={redirectParam}
				/>

				{/* Email Collection Card (Verified Consent or Manual Input) */}
				<PreviewEmailCard
					collectEmailMode={settings.collectEmail}
					userEmail={user?.email}
					recordEmailChecked={recordEmailChecked}
					onToggleRecordEmail={() => {
						setRecordEmailChecked((prev) => !prev);
						if (emailError) setEmailError(false);
					}}
					respondentEmail={respondentEmail}
					onRespondentEmailChange={(val) => {
						setRespondentEmail(val);
						if (emailError) setEmailError(false);
					}}
					emailError={emailError}
				/>

				{/* Server Error Alert Banner */}
				{serverError && (
					<div className="w-full bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-lg mb-4 flex items-center gap-2">
						<MdErrorOutline className="text-lg flex-shrink-0" />
						<span>{serverError}</span>
					</div>
				)}

				{/* Question List */}
				{items.map((item, index) => (
					<PreviewQuestionCard
						key={item._id || index}
						id={`field-question-${index}`}
						item={item}
						value={answers[index]}
						onChange={
							isViewMode
								? (val) => handleAnswerChange(index, val)
								: undefined
						}
						hasError={errors[index]}
					/>
				))}

				{/* Bottom Action Footer */}
				<PreviewFormFooter
					isViewMode={isViewMode}
					isSubmitting={isSubmitting}
					onClearForm={handleClearForm}
				/>
			</form>

			{/* Gatekeeper Sign-in Required Modal */}
			<AuthPromptModal
				isOpen={showAuthModal}
				onClose={() => setShowAuthModal(false)}
				title="Sign in to continue"
				message={
					settings.limitOneResponse
						? "This form requires you to sign in with an account because responses are limited to 1 per person."
						: "This form requires you to sign in with an account to view and submit your verified email."
				}
				redirectUrl={`/login?redirect=${redirectParam}`}
			/>
		</>
	);
};

PreviewFormCanvas.propTypes = {
	form: PropTypes.shape({
		_id: PropTypes.string,
		title: PropTypes.string,
		description: PropTypes.string,
		headerImage: PropTypes.string,
		settings: PropTypes.object,
		items: PropTypes.arrayOf(PropTypes.object),
	}),
	mode: PropTypes.oneOf(["preview", "view"]),
};

export default PreviewFormCanvas;
