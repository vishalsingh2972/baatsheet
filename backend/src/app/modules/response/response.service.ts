import { Types } from "mongoose";
import ApiError from "../../../errors/ApiError";
import { httpStatus } from "../../../shared/http-status";
import { Form } from "../form/form.model";
import { IResponse, ISubmitResponsePayload } from "./response.interface";
import { FormResponse } from "./response.model";

const submitResponse = async (
  formId: string,
  userId: string | undefined,
  userEmail: string | undefined,
  payload: ISubmitResponsePayload
): Promise<IResponse> => {
  const form = await Form.findById(formId);
  if (!form) {
    throw new ApiError(httpStatus.NOT_FOUND, "Form not found.");
  }

  // 1. Check if the form is accepting responses
  if (form.settings?.isAcceptingResponses === false) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      form.settings?.closedFormMessage ||
        "This form is no longer accepting responses."
    );
  }

  // 2. Check if deadline has passed
  if (form.settings?.deadline) {
    const deadlineDate = new Date(form.settings.deadline);
    if (!isNaN(deadlineDate.getTime()) && new Date() > deadlineDate) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        form.settings?.closedFormMessage ||
          "The deadline for this form has passed. Submissions are no longer accepted."
      );
    }
  }

  // 3. Check Verified Account email requirement
  if (form.settings?.collectEmail === "verified") {
    if (!userId || !userEmail) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "You must be signed in to fill out this form."
      );
    }
  }

  // 4. Check Limit to 1 Response per user
  if (form.settings?.limitOneResponse) {
    if (!userId) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "You must be signed in to fill out this form because submissions are limited to 1 response per account."
      );
    }

    const existingResponse = await FormResponse.findOne({
      form: new Types.ObjectId(formId),
      submittedBy: new Types.ObjectId(userId),
    });

    if (existingResponse) {
      throw new ApiError(
        httpStatus.CONFLICT,
        "You have already submitted a response to this form."
      );
    }
  }

  if (!payload.answers || !Array.isArray(payload.answers)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Answers must be provided as an array."
    );
  }

  // Determine final recorded email
  const finalEmail =
    form.settings?.collectEmail === "verified"
      ? userEmail
      : payload.respondentEmail?.trim() || userEmail || undefined;

  const newResponse = await FormResponse.create({
    form: new Types.ObjectId(formId),
    submittedBy: userId ? new Types.ObjectId(userId) : undefined,
    respondentEmail: finalEmail,
    answers: payload.answers,
  });

  return newResponse;
};

const getFormResponses = async (
  formId: string,
  userId: string
): Promise<IResponse[]> => {
  const form = await Form.findById(formId);
  if (!form) {
    throw new ApiError(httpStatus.NOT_FOUND, "Form not found.");
  }

  if (form.owner.toString() !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Not authorized to view responses for this form."
    );
  }

  const responses = await FormResponse.find({
    form: new Types.ObjectId(formId),
  }).sort({ createdAt: -1 });

  return responses;
};

const deleteAllResponses = async (
  formId: string,
  userId: string
): Promise<void> => {
  const form = await Form.findById(formId);
  if (!form) {
    throw new ApiError(httpStatus.NOT_FOUND, "Form not found.");
  }

  if (form.owner.toString() !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Not authorized to delete responses for this form."
    );
  }

  await FormResponse.deleteMany({
    form: new Types.ObjectId(formId),
  });
};

export const ResponseService = {
  submitResponse,
  getFormResponses,
  deleteAllResponses,
};
