import assert from "assert";
import path from "path";
import chalk from "chalk";
import { updateYaml } from "../src/main";
import { generateHandler, jsTemplates, tsTemplates } from "../templates";
import { yamlFileUpdatedCorrectly } from "./helpers";

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
      throw "YAML file didn't update correctly";
    }
  });

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
