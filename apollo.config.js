
const path = require("path");

module.exports = {
  client: {
    includes: ["src/**/*.tsx"],
    service: {
      localSchemaFile: path.resolve(__dirname, "graphql/schema.github.graphql")
    }
  }
};
