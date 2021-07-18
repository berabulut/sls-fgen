import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { jsTemplates } from "../templates";

// Returns boolean
export const yamlFileUpdatedCorrectly = (options) => {
  const { yamlPath, funcName, funcPath, httpPath, method } = options;

  let file = yaml.load(fs.readFileSync(yamlPath, "utf8"));

  if (!file.functions[funcName]) {
    return false;
  }

  if (!(file.functions[funcName].handler === funcPath)) {
    return false;
  }

  if (!(file.functions[funcName].events[0].http.path === httpPath)) {
    return false;
  }

  if (!(file.functions[funcName].events[0].http.method === method)) {
    return false;
  }

  return true;
};

export const functionCreatedCorrectly = async (options) => {
  const { language, template, funcPath } = options;

  let filePath = path.resolve(
    process.cwd(),
    funcPath.substring(0, funcPath.lastIndexOf(".")) + `.${language}`
  );

  let funcName = funcPath.substring(
    funcPath.lastIndexOf(".") + 1,
    funcPath.length
  );

  const tmpl = jsTemplates[template](funcName);
  if (!template)
    throw chalk.red("Couldn't find the template related to language");

  let fileReadWithPromise = fs.promises;

  let data = await fileReadWithPromise.readFile(filePath, "utf8");
  if (data === tmpl) return true;

  return false;
};
