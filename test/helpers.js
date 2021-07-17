import fs from "fs";
import yaml from "js-yaml";

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
