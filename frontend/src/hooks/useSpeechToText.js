/* eslint-disable no-unused-vars */
/* eslint-disable no-empty */
import { useState, useRef, useEffect, useCallback } from "react";

const getSpeechRecognitionClass = () => {
	if (typeof window === "undefined") return null;
	return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

export const useSpeechToText = () => {
	const [isListening, setIsListening] = useState(false);
	const [error, setError] = useState("");
	const recognitionRef = useRef(null);
	const onTranscriptRef = useRef(null);

	const isSupported = Boolean(getSpeechRecognitionClass());

	const stopListening = useCallback(() => {
		if (recognitionRef.current) {
			try {
				recognitionRef.current.stop();
			} catch (e) {
				// ignore if already stopped
			}
			recognitionRef.current = null;
		}
		setIsListening(false);
	}, []);

	const startListening = useCallback(
		({ onTranscript, lang = "bn-BD" } = {}) => {
			if (!isSupported) {
				setError(
					"Speech recognition is not supported in this browser. Please use Google Chrome or Edge.",
				);
				return;
			}

			// If already listening, stop first
			if (recognitionRef.current) {
				stopListening();
			}

			setError("");
			onTranscriptRef.current = onTranscript;

			try {
				const SpeechClass = getSpeechRecognitionClass();
				const recognition = new SpeechClass();

				recognition.continuous = true;
				recognition.interimResults = true;
				recognition.lang = lang;

				let finalTranscript = "";

				recognition.onstart = () => {
					setIsListening(true);
					setError("");
				};

				recognition.onresult = (event) => {
					let interim = "";
					for (
						let i = event.resultIndex;
						i < event.results.length;
						i++
					) {
						const res = event.results[i];
						if (res.isFinal) {
							finalTranscript += res[0].transcript + " ";
						} else {
							interim += res[0].transcript;
						}
					}

					const combined = (finalTranscript + interim).trim();
					if (onTranscriptRef.current && combined) {
						onTranscriptRef.current(combined);
					}
				};

				recognition.onerror = (event) => {
					console.warn("Speech recognition error:", event.error);
					if (event.error === "not-allowed") {
						setError(
							"Microphone access denied. Please click the camera/mic icon in the browser URL bar to allow access.",
						);
					} else if (event.error === "no-speech") {
						// User simply paused
					} else {
						setError(`Voice input error: ${event.error}`);
					}
					setIsListening(false);
				};

				recognition.onend = () => {
					setIsListening(false);
					recognitionRef.current = null;
				};

				recognitionRef.current = recognition;
				recognition.start();
			} catch (err) {
				console.error("Failed to start speech recognition:", err);
				setError("Could not start voice input. Please try again.");
				setIsListening(false);
			}
		},
		[isSupported, stopListening],
	);

	const toggleListening = useCallback(
		({ onTranscript, lang = "bn-BD" } = {}) => {
			if (isListening) {
				stopListening();
			} else {
				startListening({ onTranscript, lang });
			}
		},
		[isListening, startListening, stopListening],
	);

	// Clean up on unmount
	useEffect(() => {
		return () => {
			if (recognitionRef.current) {
				try {
					recognitionRef.current.stop();
				} catch (e) {}
			}
		};
	}, []);

	return {
		isListening,
		isSupported,
		error,
		startListening,
		stopListening,
		toggleListening,
	};
};

export default useSpeechToText;
