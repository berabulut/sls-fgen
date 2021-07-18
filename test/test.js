import assert from "assert";
import path from "path";
import { updateYaml, createFunction } from "../src/main";
import { parseArgumentsIntoOptions } from "../src/cli";
import { generateHandler, jsTemplates, tsTemplates } from "../templates";
import { functionCreatedCorrectly, yamlFileUpdatedCorrectly } from "./helpers";

describe("#updateYaml", function () {
  let rand = Math.floor(Math.random() * 10000);
  let options = {
    yamlPath: path.resolve(__dirname, "../serverless.yml"),
    funcName: `testFunc${rand}`,
    funcPath: `test${rand}.test`,
    httpPath: `test${rand}`,
    method: `post`,
  };

  it("should update yaml file correctly", function () {
    updateYaml(options);
    if (!yamlFileUpdatedCorrectly(options)) {
      throw "YAML file wasn't updated correctly";
    }
  });

  // Actually testing helper function
  it("shouldn't update yaml file correctly", function () {
    updateYaml(options);
    options = {
      ...options,
      method: "get",
    };
    if (yamlFileUpdatedCorrectly(options)) {
      throw "YAML file updated correctly but it shouldn't";
    }
  });

  it("shouldn't find target file", function () {
    options = {
      ...options,
      yamlPath: path.resolve(__dirname, `../${rand}.yml`),
    };
    try {
      updateYaml(options);
      throw "YAML file wasn't supposed to be find";
    } catch (err) {
      if (err !== "YAML file wasn't supposed to be find") return true;
      throw err;
    }
  });
});

describe("#generateHandler", function () {
  it("should return default js template", function () {
    assert.ok(
      generateHandler("js", "default", "testFunction"),
      jsTemplates["default"]("testFunction")
    );
  });
  it("should return other js template", function () {
    assert.ok(
      generateHandler("js", "default", "testFunction"),
      jsTemplates["otherTemplate"]("testFunction")
    );
  });
  it("should return default ts template", function () {
    assert.ok(
      generateHandler("ts", "default", "testFunction"),
      tsTemplates["default"]("testFunction")
    );
  });
  it("should fail there is no other ts template", function () {
    try {
      generateHandler("ts", "other", "testFunction");
    } catch (err) {
      assert.ok(
        err,
        "TypeError: _.tsTemplates[templateName] is not a function"
      );
    }
  });
  it("should throw", function () {
    try {
      generateHandler("go", "default", "testFunction");
    } catch (err) {
      assert.ok(err, "go not a valid language option!");
    }
  });
});

describe("#createFunction", function () {
  let rand = Math.floor(Math.random() * 10000);
  let options = {
    language: "js",
    template: "default",
    yamlPath: path.resolve(__dirname, "../serverless.yml"),
    funcName: `testFunc${rand}`,
    funcPath: `test${rand}.test`,
    httpPath: `test${rand}`,
    method: `post`,
  };

  before(function () {
    createFunction(options);
  });

  it("should write to a file from designated template", async function () {
    if ((await functionCreatedCorrectly(options)) === false) {
      throw "Function wasn't created correctly!";
    }
  });
  // Actually testing helper function
  it("should return false (manipulated options)", async function () {
    options.funcPath = `test${rand}.tset`;
    if ((await functionCreatedCorrectly(options)) === true) {
      throw "Function shouldn't have returned true!";
    }
  });
});

describe("#parseArgumentsIntoOptions", function () {
  const rawArgs = [
    "",
    "",
    "--language=js",
    "--template=default",
    "--funcName=hello",
    "--funcPath=handler.hello",
    "--method=get",
    "--httpPath=hello",
    "--yamlPath=serverless.yml",
  ];

  const rawFlags = [
    "",
    "",
    "-l",
    "js",
    "-t",
    "default",
    "-n",
    "hello",
    "-p",
    "handler.hello",
    "-m",
    "get",
    "-h",
    "hello",
    "-y",
    "serverless.yml",
  ]

  const expectedOptions = {
    language: "js",
    template: "default",
    funcName: "hello",
    funcPath: "handler.hello",
    method: "get",
    httpPath: "hello",
    yamlPath: "serverless.yml",
  };


  it("should parse arguments into options", function () {
    const options = parseArgumentsIntoOptions(rawArgs);
    if (JSON.stringify(options) !== JSON.stringify(expectedOptions)) {
      throw "Arguments wasn't parsed correctly to options";
    }
  });

  it("should parse flags into options", function () {
    const options = parseArgumentsIntoOptions(rawFlags);
    if (JSON.stringify(options) !== JSON.stringify(expectedOptions)) {
      throw "Flags wasn't parsed correctly to options";
    }
  });
});
