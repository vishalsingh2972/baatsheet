import mongoose, { Schema } from "mongoose";
import { IForm, IFormItem, IFormSettings } from "./form.interface";

const FormItemSchema = new Schema<IFormItem>({
  type: {
    type: String,
    enum: ["question", "title", "image"],
    required: true,
  },
  questionTitle: { type: String },
  questionType: { type: String },
  options: [{ type: String }],
  title: { type: String },
  description: { type: String },
  image: { type: String, default: "" },
  imageAlignment: {
    type: String,
    enum: ["left", "center", "right"],
    default: "center",
  },
  hoverText: { type: String, default: "" },
  required: { type: Boolean, default: false },
});

const FormSettingsSchema = new Schema<IFormSettings>(
  {
    collectEmail: {
      type: String,
      enum: ["none", "verified", "responder_input"],
      default: "none",
    },
    limitOneResponse: {
      type: Boolean,
      default: false,
    },
    deadline: {
      type: Schema.Types.Mixed,
      default: null,
    },
    isAcceptingResponses: {
      type: Boolean,
      default: true,
    },
    closedFormMessage: {
      type: String,
      default: "This form is no longer accepting responses.",
    },
    confirmationMessage: {
      type: String,
      default: "Your response has been recorded.",
    },
    showSubmitAnotherLink: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const FormSchema = new Schema<IForm>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      default: "Untitled form",
    },
    title: {
      type: String,
      required: true,
      default: "Untitled form",
    },
    description: {
      type: String,
      default: "",
    },
    headerImage: {
      type: String,
      default: "",
    },
    items: [FormItemSchema],
    settings: {
      type: FormSettingsSchema,
      default: () => ({}),
    },
    isStarred: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Form = mongoose.model<IForm>("Form", FormSchema);
