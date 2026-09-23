import express from "express";
import { FormController } from "./form.controller";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth(), FormController.createForm);
router.get("/", auth(), FormController.getUserForms);
router.get("/:id", FormController.getFormById);
router.put("/:id", auth(), FormController.updateForm);
router.patch("/:id/name", auth(), FormController.updateFormName);
router.patch("/:id/star", auth(), FormController.toggleFormStar);
router.delete("/:id", auth(), FormController.deleteForm);

export const FormRoutes = router;
