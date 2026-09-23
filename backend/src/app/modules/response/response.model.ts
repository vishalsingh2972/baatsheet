import mongoose, { Schema } from "mongoose";
import { IAnswer, IResponse } from "./response.interface";

const AnswerSchema = new Schema<IAnswer>({
  itemIndex: {
    type: Number,
    required: true,
  },
  value: {
    type: Schema.Types.Mixed,
    required: true,
  },
});

const ResponseSchema = new Schema<IResponse>(
  {
    form: {
      type: Schema.Types.ObjectId,
      ref: "Form",
      required: true,
    },
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    respondentEmail: {
      type: String,
      trim: true,
    },
    answers: [AnswerSchema],
  },
  {
    timestamps: true,
  }
);

export const FormResponse = mongoose.model<IResponse>(
  "Response",
  ResponseSchema
);
