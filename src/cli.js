import fs from "fs";
import arg from "arg";
import path from "path";
import chalk from "chalk";
import inquirer from "inquirer";
import { createFunction } from "./main";
import { templates } from "../languages/javascript/templates";

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--template": String,
      "--funcName": String,
      "--funcPath": String,
      "--method": String,
      "--httpPath": String,
      "--yamlPath": String,

      "-n": "--funcName",
      "-p": "--funcPath",
      "-m": "--method",
      "-h": "--httpPath",
      "-y": "--yamlPath",
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    template: args["--template"],
    funcName: args["--funcName"],
    funcPath: args["--funcPath"],
    method: args["--method"],
    httpPath: args["--httpPath"],
    yamlPath: args["--yamlPath"],
  };
}

async function promptForMissingOptions(options) {
  const defaults = {
    template: "default",
    funcName: "hello",
    funcPath: "handler.hello",
    method: "GET",
    httpPath: "hello",
    yamlPath: path.resolve(process.cwd(), "./serverless.yml"),
  };

  const questions = [];

  if (!options.template) {
    questions.push({
      type: "list",
      name: "template",
      message: "Pick a handler template!",
      choices: Object.keys(templates),
      default: defaults.method,
    });
  }

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

  const answers = await inquirer.prompt(questions);

  return {
    ...options,
    template: options.template || answers.template,
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

  if (!fs.existsSync(options.yamlPath)) {
    console.log(chalk.red("YAML file doesn't exist!"));
    return;
  }

  await createFunction(options);
}
