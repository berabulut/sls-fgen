export { default as jsTemplates } from "./js";
export { default as tsTemplates } from "./ts";

import { jsTemplates, tsTemplates } from ".";
import chalk from "chalk";

/**
 * Generates a handler function.
 *
 * @param language
 * Name of the language
 * js, ts, go, py
 *
 * @param templateName
 * Name of the template.
 *
 * @param funcName
 * Name of the function.
 *
 * @returns
 * A string contains the function.
 */

export const generateHandler = (language, templateName, funcName) => {
  if (language === "js") {
    return jsTemplates[templateName](funcName);
  }
  if (language === "ts") {
    return tsTemplates[templateName](funcName);
  }
  throw chalk.cyan(language) + chalk.red(" not a valid language option!");
};
