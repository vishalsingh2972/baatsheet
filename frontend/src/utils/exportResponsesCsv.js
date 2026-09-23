/**
 * Generates an RFC 4180 compliant CSV string from form responses and triggers browser download.
 * @param {Object} form - Form schema object containing items and settings
 * @param {Array} responses - Array of response submission objects
 */
export const exportResponsesToCSV = (form, responses) => {
	if (!responses || responses.length === 0) return;

	// Extract questions from form items
	const questions =
		form?.items?.filter((item) => item.type === "question") || [];
	const hasEmail =
		form?.settings?.collectEmail === "responder_input" ||
		form?.settings?.collectEmail === "verified" ||
		responses.some((r) => r.respondentEmail);

	// Build headers
	const headers = ["Timestamp"];
	if (hasEmail) {
		headers.push("Email Address");
	}
	questions.forEach((q, idx) => {
		headers.push(q.questionTitle || `Question ${idx + 1}`);
	});

	// Helper to safely escape cell text according to RFC 4180
	const escapeCSV = (val) => {
		if (val === null || val === undefined) return '""';
		let str = String(val);
		if (
			str.includes(",") ||
			str.includes('"') ||
			str.includes("\n") ||
			str.includes("\r")
		) {
			str = `"${str.replace(/"/g, '""')}"`;
		} else {
			str = `"${str}"`;
		}
		return str;
	};

	// Build data rows
	const rows = responses.map((resp) => {
		const row = [];
		// 1. Timestamp
		row.push(escapeCSV(new Date(resp.createdAt).toLocaleString()));
		// 2. Email Address
		if (hasEmail) {
			row.push(escapeCSV(resp.respondentEmail || ""));
		}
		// 3. Question answers
		questions.forEach((q, qIndex) => {
			const ansObj =
				resp.answers?.find((a) => a.itemIndex === qIndex) ||
				resp.answers?.[qIndex];
			let ansVal = ansObj
				? ansObj.value !== undefined
					? ansObj.value
					: ansObj
				: "";
			if (Array.isArray(ansVal)) {
				ansVal = ansVal.join(", ");
			}
			row.push(escapeCSV(ansVal));
		});
		return row.join(",");
	});

	// Add UTF-8 BOM (\uFEFF) for Excel & Google Sheets compatibility
	const csvContent =
		"\uFEFF" + [headers.map(escapeCSV).join(","), ...rows].join("\r\n");

	// Trigger download
	const blob = new Blob([csvContent], {
		type: "text/csv;charset=utf-8;",
	});
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	const safeTitle = (form?.title || "Form").replace(/[^a-zA-Z0-9_-]/g, "_");
	link.setAttribute("href", url);
	link.setAttribute("download", `${safeTitle}_Responses.csv`);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
};
