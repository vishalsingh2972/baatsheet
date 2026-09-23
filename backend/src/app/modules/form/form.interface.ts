import { Document, Types } from "mongoose";

export interface IFormItem {
  type: "question" | "title" | "image";
  questionTitle?: string;
  questionType?:
    | "multiplechoice"
    | "checkbox"
    | "paragraph"
    | "shortanswer"
    | string;
  options?: string[];
  title?: string;
  description?: string;
  image?: string;
  imageAlignment?: "left" | "center" | "right";
  hoverText?: string;
  required?: boolean;
}

export interface IFormSettings {
  collectEmail?: "none" | "verified" | "responder_input";
  limitOneResponse?: boolean;
  deadline?: Date | string | null;
  isAcceptingResponses?: boolean;
  closedFormMessage?: string;
  confirmationMessage?: string;
  showSubmitAnotherLink?: boolean;
}

export interface IForm extends Document {
  owner: Types.ObjectId;
  name?: string;
  title: string;
  description: string;
  headerImage?: string;
  items: IFormItem[];
  settings?: IFormSettings;
  isStarred?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateFormPayload {
  name?: string;
  title?: string;
  description?: string;
  headerImage?: string;
  items?: IFormItem[];
  settings?: IFormSettings;
  isStarred?: boolean;
}

export interface IUpdateFormPayload {
  name?: string;
  title?: string;
  description?: string;
  headerImage?: string;
  items?: IFormItem[];
  settings?: IFormSettings;
  isStarred?: boolean;
}
