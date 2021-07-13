import fs from "fs";
import yaml from "js-yaml";

export const createFunction = async (options) => {
  // targetDirectory is where sls-fgen called from. Function path is related to targetDirectory .

  options = {
    ...options,
    targetDirectory: process.cwd(),
  };

  console.log(options);

  // Seperate file path from function name.
  // Example: handler.hello
  // filePath -> handler.js
  // funcName -> hello

  let filePath =
    options.funcPath.substring(0, options.funcPath.lastIndexOf(".")) + ".js";

  let funcName = options.funcPath.substring(
    options.funcPath.lastIndexOf(".") + 1,
    options.funcPath.length
  );

  let handler =
    `'use strict'` +
    `\n\n` +
    `module.exports.${funcName} = async (event) => {
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Go Serverless v2.0! Your function executed successfully!',
          input: event,
        },
        null,
        2
      ),
    };
  };`;

  updateYaml(options);

  // Write function to a file
  fs.writeFile(filePath, handler, function (err) {
    if (err) return console.log(err);
    console.log(`${funcName} > ${filePath}`);
  });
};

// Update serverless.yml file
const updateYaml = (options) => {
  const { yamlPath, funcName, funcPath, httpPath, method } = options;

  try {
    let file = yaml.load(fs.readFileSync(yamlPath, "utf8"));
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
