import assert from "assert";
import { generateHandler, jsTemplates } from "../templates";

describe("#generateHandler", function () {
  it("should return default js template", function () {
    assert.equal(
      generateHandler("js", "default", "testFunction"),
      jsTemplates["default"]("testFunction")
    );
  });
});
//
