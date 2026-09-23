import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { httpStatus } from "../../../shared/http-status";
import { AuthService } from "./auth.service";
import { AuthenticatedRequest } from "../../middlewares/auth";
import ApiError from "../../../errors/ApiError";

const signup = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Email and password are required."
    );
  }

  const result = await AuthService.signup({ name, email, password });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully.",
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Email and password are required."
    );
  }

  const result = await AuthService.login({ email, password });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged in successfully.",
    data: result,
  });
});

const getProfile = catchAsync(async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Not authenticated.");
  }

  const result = await AuthService.getProfile(user.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile retrieved successfully.",
    data: result,
  });
});

export const AuthController = {
  signup,
  login,
  getProfile,
};
