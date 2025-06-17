// sanitize.ts
import xss from "xss";

/**
 * Sanitize all string fields in an object to prevent XSS attacks.
 * @param input - The object with string fields that need to be sanitized.
 * @returns A new object with sanitized string fields.
 */
export const sanitizeObject = (
  input: Record<string, any>
): Record<string, any> => {
  const sanitizedInput: Record<string, any> = {};

  for (const key in input) {
    if (typeof input[key] === "string") {
      sanitizedInput[key] = sanitizeString(input[key]);
    } else {
      sanitizedInput[key] = input[key]; // Non-string fields are copied as-is
    }
  }

  return sanitizedInput;
};

export const sanitizeString = (str: string) => {
  return xss(str.trim()); // Trim the string before sanitizing
};
