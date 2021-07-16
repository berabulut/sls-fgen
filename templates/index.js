export { default as jsTemplates } from "./js";
export { default as tsTemplates } from "./ts";

import { jsTemplates, tsTemplates } from ".";

export const languages = ["js", "ts"];

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

export const generateHandler = (language, templateName, funcName) => {
  if (language === "js") {
    return jsTemplates[templateName](funcName);
  }

  return tsTemplates[templateName](funcName);
};
