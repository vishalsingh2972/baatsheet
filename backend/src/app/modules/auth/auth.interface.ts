import { Document } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISignupUser {
  name?: string;
  email: string;
  password: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface ILoginResponse {
  user: {
    id: string;
    name?: string;
    email: string;
  };
  token: string;
}
