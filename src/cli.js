import fs from "fs";
import arg from "arg";
import path from "path";
import chalk from "chalk";
import inquirer from "inquirer";
import launch from "launch-editor";
import defaults from "./defaults";
import { createFunction } from "./main";
import { jsTemplates, tsTemplates } from "../templates";

export function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--language": String,
      "--template": String,
      "--funcName": String,
      "--funcPath": String,
      "--method": String,
      "--httpPath": String,
      "--yamlPath": String,
      "--edit": String,
      "--skip": Boolean,

      "-l": "--language",
      "-t": "--template",
      "-n": "--funcName",
      "-p": "--funcPath",
      "-m": "--method",
      "-h": "--httpPath",
      "-y": "--yamlPath",
      "-e": "--edit",
      "-s": "--skip",
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    language: args["--language"],
    template: args["--template"],
    funcName: args["--funcName"],
    funcPath: args["--funcPath"],
    method: args["--method"],
    httpPath: args["--httpPath"],
    yamlPath: args["--yamlPath"],
    edit: args["--edit"],
    skip: args["--skip"],
  };
}

export async function promptForMissingOptions(options) {
  if (options.skip) {
    return {
      ...options,
      language: options.language || defaults.language,
      template: options.template || defaults.template,
      funcName: options.funcName || defaults.funcName,
      funcPath: options.funcPath || defaults.funcPath,
      method: options.method || defaults.method,
      httpPath: options.httpPath || defaults.httpPath,
      yamlPath: options.yamlPath || defaults.yamlPath,
    };
  }

  const questions = [];
  let answers = {};

  if (!options.language) {
    answers = await inquirer.prompt({
      type: "list",
      name: "language",
      message: "Language:",
      choices: ["js", "ts"],
      default: defaults.language,
    });
  }

  if (!options.template) {
    let choices;
    if ((answers.language || options.language) === "js") {
      choices = jsTemplates;
    } else if ((answers.language || options.language) === "ts") {
      choices = tsTemplates;
    } else {
      console.log(chalk.red("Not a valid language!"));
      process.exit(1);
    }

    questions.push({
      type: "list",
      name: "template",
      message: "Handler template!",
      choices: Object.keys(choices),
      default: defaults.template,
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

  answers = {
    ...answers,
    ...(await inquirer.prompt(questions)),
  };

  return {
    ...options,
    language: options.language || answers.language,
    template: options.template || answers.template,
    funcName: options.funcName || answers.funcName,
    funcPath: options.funcPath || answers.funcPath,
    method: options.method || answers.method,
    httpPath: options.httpPath || answers.httpPath,
    yamlPath: options.yamlPath || answers.yamlPath,
  };
}

export async function cli(args, mode) {
  let options = parseArgumentsIntoOptions(args);

  // Launch VS Code on --edit arg
  if (options.edit) {
    launch(
      path.resolve(__dirname, `./defaults.js`),
      // try specific editor bin first (optional)
      "code",
      // callback if failed to launch (optional)
      (fileName, errorMsg) => {
        const msg = `Can't launch ${fileName} with VS Code! ${errorMsg}`;
        if (mode === "test") throw msg;
        console.log(chalk.red(msg));
      }
    );

    if (options.edit === "defaults") {
      return;
    }

    launch(
      path.resolve(__dirname, `../templates/${options.edit}/index.js`),
      // try specific editor bin first (optional)
      "code",
      // callback if failed to launch (optional)
      (fileName, errorMsg) => {
        const msg = `Can't launch ${fileName} with VS Code! ${errorMsg}`;
        if (mode === "test") throw msg;
        console.log(chalk.red(msg));
      }
    );

    return;
  }

  options = await promptForMissingOptions(options);

  if (!fs.existsSync(options.yamlPath)) {
    const msg = "YAML file doesn't exist!";
    if (mode === "test") throw msg;
    console.log(chalk.red(msg));
    return;
  }

  await createFunction(options);
}
