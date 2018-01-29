"use strict";

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.onCreatePage = ({ page, store, boundActionCreators }) => {
  // Copy /404/ to /404.html as many static site hosts expect
  // site 404 pages to be named this.
  // https://www.gatsbyjs.org/docs/add-404-page/
  console.log(page.path);
  if (page.path.match(/\/404\/$/)) {
    console.log(page.path, page.path.replace(/\/404\/$/, `404.html`));
    boundActionCreators.createPage((0, _extends3.default)({}, page, {
      path: page.path.replace(/404\/$/, `404.html`)
    }));
  }
};
//# sourceMappingURL=gatsby-node.js.map