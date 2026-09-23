import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
	env: process.env.NODE_ENV || "development",
	port: process.env.PORT || 5000,
	database_url: process.env.MONGODB_URI || "mongodb://localhost:27017/google-form",
	client_url: process.env.CLIENT_URL || "http://localhost:5173",
	jwt: {
		secret: process.env.JWT_SECRET || "super_secret_google_form_clone_key_123456",
		expires_in: process.env.JWT_EXPIRES_IN || "7d",
	},
	gemini_api_key: process.env.GEMINI_API_KEY || "",
};
