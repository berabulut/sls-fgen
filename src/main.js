import fs from "fs";
import yaml from "js-yaml";
import { generateHandler } from "../templates/javascript";

export const createFunction = async (options) => {
  let { funcPath } = options;

  // Seperate file path from function name.
  // Example: handler.hello
  // filePath -> handler.js
  // funcName -> hello
  let filePath = funcPath.substring(0, funcPath.lastIndexOf(".")) + ".js";
  let funcName = funcPath.substring(
    funcPath.lastIndexOf(".") + 1,
    funcPath.length
  );

  updateYaml(options);
  
  // Write function to a file
  fs.writeFile(filePath, generateHandler(funcName), function (err) {
    if (err) return console.log(err);
    console.log(`${funcName} > ${filePath}`);
  });
};

// Update serverless.yml file
const updateYaml = (options) => {
  const { yamlPath, funcName, funcPath, httpPath, method } = options;

  try {
    let file = yaml.load(fs.readFileSync(yamlPath, "utf8"));
    // Add new function
    file = {
      ...file,
      functions: {
        ...file.functions,
        [funcName]: {
          handler: funcPath,
          events: [
            {
              http: {
                path: httpPath,
                method: method,
              },
            },
          ],
        },
      },
    };

    fs.writeFileSync(yamlPath, yaml.dump(file));
  } catch (err) {
    console.log(err);
  }
};
