/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { MdMic, MdMicOff } from "react-icons/md";
import useSpeechToText from "../../hooks/useSpeechToText";
import useClickOutside from "../../hooks/useClickOutside";

const SUPPORTED_LANGUAGES = [
	{ code: "bn-BD", label: "বাংলা", flag: "🇧🇩" },
	{ code: "en-US", label: "English", flag: "🇺🇸" },
	{ code: "es-ES", label: "Español", flag: "🇪🇸" },
	{ code: "ar-SA", label: "العربية", flag: "🇸🇦" },
	{ code: "hi-IN", label: "हिन्दी", flag: "🇮🇳" },
];

const VoiceInputButton = ({
	onTranscript,
	disabled = false,
	className = "",
	title = "Speak to dictate prompt",
}) => {
	const [selectedLang, setSelectedLang] = useState(() => {
		try {
			return localStorage.getItem("gf_voice_lang") || "bn-BD";
		} catch (e) {
			return "bn-BD";
		}
	});

	const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
	const menuRef = useRef(null);

	useClickOutside(menuRef, () => setIsLangMenuOpen(false), isLangMenuOpen);

	const { isListening, isSupported, toggleListening, error } =
		useSpeechToText();

	useEffect(() => {
		try {
			localStorage.setItem("gf_voice_lang", selectedLang);
		} catch (e) {}
	}, [selectedLang]);

	if (!isSupported) return null;

	const handleMicClick = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (disabled) return;
		toggleListening({ onTranscript, lang: selectedLang });
	};

	const currentLangObj =
		SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang) ||
		SUPPORTED_LANGUAGES[0];

	return (
		<div className="relative inline-flex items-center gap-1 bg-white/90 p-0.5 rounded-xl border border-gray-200/80 shadow-2xs">
			{/* Language Switcher Pill */}
			<div ref={menuRef} className="relative">
				<button
					type="button"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						setIsLangMenuOpen((prev) => !prev);
					}}
					title={`Current language: ${currentLangObj.label}. Click to switch.`}
					className="text-[11px] font-semibold text-[#5F6368] hover:text-[#673AB7] hover:bg-purple-50 px-1.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer"
				>
					<span>{currentLangObj.flag}</span>
					<span className="hidden sm:inline text-[10px]">
						{currentLangObj.label}
					</span>
				</button>

				{/* Language Dropdown Menu */}
				{isLangMenuOpen && (
					<div className="absolute right-0 bottom-full mb-1.5 w-32 bg-white rounded-xl shadow-xl border border-[#DADCE0] py-1 z-50 animate-scale-up">
						<div className="px-2.5 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
							Speech Language
						</div>
						{SUPPORTED_LANGUAGES.map((lang) => (
							<button
								key={lang.code}
								type="button"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									setSelectedLang(lang.code);
									setIsLangMenuOpen(false);
								}}
								className={`w-full px-2.5 py-1.5 text-xs text-left flex items-center justify-between hover:bg-purple-50 transition cursor-pointer ${
									selectedLang === lang.code
										? "text-[#673AB7] font-bold bg-purple-50/50"
										: "text-[#202124]"
								}`}
							>
								<div className="flex items-center gap-1.5">
									<span>{lang.flag}</span>
									<span>{lang.label}</span>
								</div>
								{selectedLang === lang.code && (
									<span className="w-1.5 h-1.5 rounded-full bg-[#673AB7]" />
								)}
							</button>
						))}
					</div>
				)}
			</div>

			{/* Microphone Button */}
			<button
				type="button"
				onClick={handleMicClick}
				disabled={disabled}
				title={
					isListening
						? `Listening in ${currentLangObj.label}... Click to stop`
						: `${title} (${currentLangObj.label})`
				}
				className={`relative p-1.5 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center ${
					isListening
						? "bg-red-500 text-white shadow-md animate-pulse ring-2 ring-red-300"
						: "hover:bg-[#673AB7]/10 text-[#5F6368] hover:text-[#673AB7]"
				} ${className}`}
			>
				{isListening ? (
					<MdMicOff className="text-sm" />
				) : (
					<MdMic className="text-sm" />
				)}

				{/* Pulsing Dot when listening */}
				{isListening && (
					<span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
						<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
						<span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
					</span>
				)}
			</button>

			{error && (
				<span className="sr-only" role="alert">
					{error}
				</span>
			)}
		</div>
	);
};

VoiceInputButton.propTypes = {
	onTranscript: PropTypes.func.isRequired,
	disabled: PropTypes.bool,
	className: PropTypes.string,
	title: PropTypes.string,
};

export default VoiceInputButton;
