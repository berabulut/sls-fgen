import arg from "arg";
import path from "path";
import inquirer from "inquirer";
import { createFunction } from "./main";

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--funcName": String,
      "--funcPath": String,
      "--method": String,
      "--httpPath": String,
      "--yamlPath": String,

      "-fn": "--funcName",
      "-fp": "--funcPath",
      "-m": "--method",
      "-hp": "--httpPath",
      "-yp": "--yamlPath",
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    funcName: args["--funcName"],
    funcPath: args["--funcPath"],
    method: args["--method"],
    httpPath: args["--httpPath"],
    yamlPath: args["--yamlPath"],
  };
}

async function promptForMissingOptions(options) {
  const defaults = {
    funcName: "hello",
    funcPath: "handler.hello",
    method: "GET",
    httpPath: "hello",
    yamlPath: path.resolve(process.cwd(), "./serverless.yml"),
  };

  // const defaultTemplate = "JavaScript";
  // if (options.skipPrompts) {
  //   return {
  //     ...options,
  //     template: options.template || defaultTemplate,
  //   };
  // }

  const questions = [];
  if (!options.funcName) {
    questions.push({
      type: "input",
      name: "funcName",
      message: "Please type a function name:",
      default: defaults.funcName,
    });
  }

  if (!options.funcPath) {
    questions.push({
      type: "input",
      name: "funcPath",
      message: "Handler function path:",
      default: defaults.funcPath,
    });
  }

  if (!options.method) {
    questions.push({
      type: "list",
      name: "method",
      message: "HTTP method:",
      choices: ["post", "get", "put", "patch", "delete"],
      default: defaults.method,
    });
  }

  if (!options.httpPath) {
    questions.push({
      type: "input",
      name: "httpPath",
      message: "HTTP path:",
      default: defaults.httpPath,
    });
  }

  if (!options.yamlPath) {
    questions.push({
      type: "input",
      name: "yamlPath",
      message: "serverless.yml path:",
      default: defaults.yamlPath,
    });
  }

  // if (!options.git) {
  //   questions.push({
  //     type: "confirm",
  //     name: "git",
  //     message: "Initialize a git repository?",
  //     default: false,
  //   });
  // }

  const answers = await inquirer.prompt(questions);

  return {
    ...options,
    funcName: options.funcName || answers.funcName,
    funcPath: options.funcPath || answers.funcPath,
    method: options.method || answers.method,
    httpPath: options.httpPath || answers.httpPath,
    yamlPath: options.yamlPath || answers.yamlPath,
  };
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  await createFunction(options);
}
