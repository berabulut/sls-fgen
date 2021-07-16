import assert from "assert";
import { generateHandler, jsTemplates, tsTemplates } from "../templates";

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
