import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { httpStatus } from "../../../shared/http-status";
import { ResponseService } from "./response.service";
import { AuthenticatedRequest } from "../../middlewares/auth";
import ApiError from "../../../errors/ApiError";

const submitResponse = catchAsync(async (req: Request, res: Response) => {
  const { formId } = req.params;
  const user = (req as AuthenticatedRequest).user;

  const result = await ResponseService.submitResponse(
    formId,
    user?.id,
    user?.email,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Response submitted successfully.",
    data: result,
  });
});

const getFormResponses = catchAsync(async (req: Request, res: Response) => {
  const { formId } = req.params;
  const user = (req as AuthenticatedRequest).user;

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Not authenticated.");
  }

  const result = await ResponseService.getFormResponses(formId, user.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Form responses retrieved successfully.",
    data: result,
  });
});

const deleteAllResponses = catchAsync(async (req: Request, res: Response) => {
  const { formId } = req.params;
  const user = (req as AuthenticatedRequest).user;

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Not authenticated.");
  }

  await ResponseService.deleteAllResponses(formId, user.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All responses deleted successfully.",
    data: null,
  });
});

export const ResponseController = {
  submitResponse,
  getFormResponses,
  deleteAllResponses,
};
