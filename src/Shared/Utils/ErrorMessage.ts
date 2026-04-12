export const getErrorMessage = (err: unknown): string => {
  if (!err) return "";

  // if string (most common in your setup)
  if (typeof err === "string") return err;

  // if axios / backend object
  if (typeof err === "object") {
    const errorObj = err as any;

    if (errorObj.message) return errorObj.message;
    if (errorObj.title) return errorObj.title;

    // fallback dynamic (still not hardcoded message)
    return JSON.stringify(errorObj);
  }

  return String(err);
};