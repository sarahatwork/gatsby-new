"use strict";

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** *
 * Jobs of this module
 * - Maintain the list of components in the Redux store. So monitor new components
 *   and add/remove components.
 * - Watch components for query changes and extract these and update the store.
 * - Ensure all page queries are run as part of bootstrap and report back when
 *   this is done
 * - Whenever a query changes, re-run all pages that rely on this query.
 ***/

const _ = require(`lodash`);
const chokidar = require(`chokidar`);

const { store } = require(`../../redux/`);
const { boundActionCreators } = require(`../../redux/actions`);
const queryCompiler = require(`./query-compiler`).default;
const queue = require(`./query-queue`);
const normalize = require(`normalize-path`);

exports.extractQueries = () => {
  const state = store.getState();
  const pagesAndLayouts = [...state.pages, ...state.layouts];
  const components = _.uniq(pagesAndLayouts.map(p => p.component));
  const queryCompilerPromise = queryCompiler().then(queries => {
    components.forEach(component => {
      const query = queries.get(normalize(component));
      boundActionCreators.replaceComponentQuery({
        query: query && query.text,
        componentPath: component
      });
    });

    return;
  });

  // During development start watching files to recompile & run
  // queries on the fly.
  if (process.env.NODE_ENV !== `production`) {
    watch();

    // Ensure every component is being watched.
    components.forEach(component => {
      watcher.add(component);
    });
  }

  return queryCompilerPromise;
};

const runQueriesForComponent = componentPath => {
  const pages = getPagesForComponent(componentPath);
  // Remove page & layout data dependencies before re-running queries because
  // the changing of the query could have changed the data dependencies.
  // Re-running the queries will add back data dependencies.
  boundActionCreators.deleteComponentsDependencies(pages.map(p => p.path || p.id));
  pages.forEach(page => queue.push((0, _extends3.default)({}, page, { _id: page.id, id: page.jsonName })));

  return new Promise(resolve => {
    queue.on(`drain`, () => resolve());
  });
};

const getPagesForComponent = componentPath => {
  const state = store.getState();
  return [...state.pages, ...state.layouts].filter(p => p.componentPath === componentPath);
};

let watcher;
exports.watchComponent = componentPath => {
  // We don't start watching until mid-way through the bootstrap so ignore
  // new components being added until then. This doesn't affect anything as
  // when extractQueries is called from bootstrap, we make sure that all
  // components are being watched.
  if (watcher) {
    watcher.add(componentPath);
  }
};
const watch = rootDir => {
  if (watcher) return;
  const debounceCompile = _.debounce(() => {
    queryCompiler().then(queries => {
      const components = store.getState().components;
      queries.forEach(({ text }, id) => {
        // Queries can be parsed from non page/layout components e.g. components
        // with fragments so ignore those.
        //
        // If the query has changed, set the new query in the store and run
        // its queries.
        if (components[id] && text !== components[id].query) {
          boundActionCreators.replaceComponentQuery({
            query: text,
            componentPath: id
          });
          runQueriesForComponent(id);
        }
      });
    });
  }, 100);

  watcher = chokidar.watch(`${rootDir}/src/**/*.{js,jsx,ts,tsx}`).on(`change`, path => {
    debounceCompile();
  });
};
//# sourceMappingURL=query-watcher.js.map