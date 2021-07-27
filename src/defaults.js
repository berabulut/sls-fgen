import path from "path";

const defaults = {
  language: "js",
  template: "default",
  funcName: "hello",
  funcPath: "handler.hello",
  method: "GET",
  httpPath: "hello",
  yamlPath: path.resolve(process.cwd(), "./serverless.yml"),
};

export default defaults