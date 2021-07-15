import { templates } from "./templates";

/**
 * Generates a handler function.
 *
 * @param funcName
 * The name of the function.
 *
 * @param templateName
 * The name of the template.
 *
 * @returns
 * A string contains the function.
 */

export const generateHandler = (templateName, funcName) => {
  return templates[templateName](funcName);
};
