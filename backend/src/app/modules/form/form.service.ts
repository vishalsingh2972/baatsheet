import { Types } from "mongoose";
import ApiError from "../../../errors/ApiError";
import { httpStatus } from "../../../shared/http-status";
import { ICreateFormPayload, IForm, IUpdateFormPayload } from "./form.interface";
import { Form } from "./form.model";

const createForm = async (
  userId: string,
  payload: ICreateFormPayload
): Promise<IForm> => {
  const newForm = await Form.create({
    owner: new Types.ObjectId(userId),
    name: payload.name || "Untitled form",
    title: payload.title || "Untitled form",
    description: payload.description || "",
    headerImage: payload.headerImage || "",
    items: payload.items || [],
    settings: payload.settings || {},
    isStarred: payload.isStarred || false,
  });

  return newForm;
};

const getUserForms = async (userId: string): Promise<IForm[]> => {
  const forms = await Form.find({ owner: new Types.ObjectId(userId) }).sort({
    updatedAt: -1,
  });
  return forms;
};

const getFormById = async (formId: string): Promise<IForm | null> => {
  const form = await Form.findById(formId);
  if (!form) {
    throw new ApiError(httpStatus.NOT_FOUND, "Form not found.");
  }
  return form;
};

const updateFormName = async (
  userId: string,
  formId: string,
  name: string
): Promise<IForm | null> => {
  const form = await Form.findById(formId);
  if (!form) {
    throw new ApiError(httpStatus.NOT_FOUND, "Form not found.");
  }
  if (form.owner.toString() !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, "Not authorized to update this form.");
  }
  form.name = name;
  return form.save();
};

const toggleFormStar = async (
  userId: string,
  formId: string,
  isStarred: boolean
): Promise<IForm | null> => {
  const form = await Form.findById(formId);
  if (!form) {
    throw new ApiError(httpStatus.NOT_FOUND, "Form not found.");
  }
  if (form.owner.toString() !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Not authorized to update this form."
    );
  }
  form.isStarred = isStarred;
  return form.save();
};

const updateForm = async (
  userId: string,
  formId: string,
  payload: IUpdateFormPayload
): Promise<IForm | null> => {
  const form = await Form.findById(formId);
  if (!form) {
    throw new ApiError(httpStatus.NOT_FOUND, "Form not found.");
  }

  if (form.owner.toString() !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Not authorized to update this form."
    );
  }

  if (payload.name !== undefined) form.name = payload.name;
  if (payload.title !== undefined) form.title = payload.title;
  if (payload.description !== undefined) form.description = payload.description;
  if (payload.headerImage !== undefined) form.headerImage = payload.headerImage;
  if (payload.items !== undefined) form.items = payload.items;
  if (payload.settings !== undefined) {
    form.settings = { ...form.settings, ...payload.settings };
  }
  if (payload.isStarred !== undefined) form.isStarred = payload.isStarred;

  const updatedForm = await form.save();
  return updatedForm;
};

const deleteForm = async (userId: string, formId: string): Promise<void> => {
  const form = await Form.findById(formId);
  if (!form) {
    throw new ApiError(httpStatus.NOT_FOUND, "Form not found.");
  }

  if (form.owner.toString() !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Not authorized to delete this form."
    );
  }

  await Form.deleteOne({ _id: formId });
};

export const FormService = {
  createForm,
  getUserForms,
  getFormById,
  updateForm,
  updateFormName,
  toggleFormStar,
  deleteForm,
};
