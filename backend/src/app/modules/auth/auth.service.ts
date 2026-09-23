import bcrypt from "bcryptjs";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import { httpStatus } from "../../../shared/http-status";
import { jwtHelpers } from "../../../shared/jwtHelpers";
import { ILoginResponse, ILoginUser, ISignupUser, IUser } from "./auth.interface";
import { User } from "./auth.model";

const signup = async (payload: ISignupUser): Promise<ILoginResponse> => {
  const { name, email, password } = payload;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    name: name || "",
    email,
    password: hashedPassword,
  });

  const token = jwtHelpers.createToken(
    { id: newUser._id.toString(), email: newUser.email },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    user: {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
    },
    token,
  };
};

const login = async (payload: ILoginUser): Promise<ILoginResponse> => {
  const { email, password } = payload;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials.");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password || "");
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials.");
  }

  const token = jwtHelpers.createToken(
    { id: user._id.toString(), email: user.email },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    },
    token,
  };
};

const getProfile = async (userId: string): Promise<Partial<IUser> | null> => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
  }
  return user;
};

export const AuthService = {
  signup,
  login,
  getProfile,
};
