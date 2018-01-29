"use strict";

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const express = require(`express`);
const graphqlHTTP = require(`express-graphql`);
const { store } = require(`../redux`);

// Note: the store must exist already. Create it with `gatsby build`.
module.exports = (() => {
  var _ref = (0, _asyncToGenerator3.default)(function* (program) {
    let { port, host } = program;
    port = typeof port === `string` ? parseInt(port, 10) : port;

    const app = express();
    app.use(`/`, graphqlHTTP({
      schema: store.getState().schema,
      graphiql: true
    }));

    console.log(`Gatsby data explorer running at`, `http://${host}:${port}`);
    app.listen(port, host);
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();
//# sourceMappingURL=data-explorer.js.map