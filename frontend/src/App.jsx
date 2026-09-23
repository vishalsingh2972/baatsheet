import { createBrowserRouter } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import HomePage from "./pages/HomePage";
import CreateOrEditFormPage from "./pages/CreateOrEditFormPage";
import FormPreviewPage from "./pages/FormPreviewPage";
import FormViewPage from "./pages/FormViewPage";
import NotFoundPage from "./pages/NotFoundPage";

const router = createBrowserRouter([
	{
		path: "/",
		element: <HomePage />,
	},
	{
		path: "/forms/create",
		element: <CreateOrEditFormPage />,
	},
	{
		path: "/forms/:id/edit",
		element: <CreateOrEditFormPage />,
	},
	{
		path: "/forms/:id/preview",
		element: <FormPreviewPage />,
	},
	{
		path: "/forms/:id/view",
		element: <FormViewPage />,
	},
	{
		path: "/register",
		element: <RegistrationPage />,
	},
	{
		path: "/login",
		element: <LoginPage />,
	},
	{
		path: "*",
		element: <NotFoundPage />,
	},
]);

export default router;
