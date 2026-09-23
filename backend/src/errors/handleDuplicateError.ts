import { IGenericErrorMessage, IGenericErrorResponse } from "../interfaces/error";

const handleDuplicateError = (error: any): IGenericErrorResponse => {
  const key = error?.keyValue ? Object.keys(error.keyValue)[0] : "field";
  const value = error?.keyValue ? error.keyValue[key] : "";

  const errors: IGenericErrorMessage[] = [
    {
      path: key,
      message: `${value ? `"${value}"` : key} already exists.`,
    },
  ];

  const statusCode = 409;
  return {
    statusCode,
    message: `${key.charAt(0).toUpperCase() + key.slice(1)} already exists.`,
    errorMessages: errors,
  };
};

export default handleDuplicateError;
