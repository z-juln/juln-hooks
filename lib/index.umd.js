(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('react-router-dom'), require('qs')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react', 'react-router-dom', 'qs'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["juln-hooks"] = {}, global.react, global.reactRouterDom, global.qs));
})(this, (function (exports, react, reactRouterDom, qs) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var qs__default = /*#__PURE__*/_interopDefaultLegacy(qs);

  var useAutoFontSize = function (elRef, cbClassName // 溢出时元素的className
  ) {
      react.useEffect(function () {
          var el = elRef.current;
          if (!el)
              return;
          if (el.scrollHeight > el.clientHeight) {
              el.classList.add(cbClassName);
          }
          else {
              el.classList.remove(cbClassName);
          }
      }, [elRef.current]);
  };

  var useQueryParams = function (params) {
      var location = reactRouterDom.useLocation();
      var queryStr = location.search.split("?")[1];
      var query = qs__default["default"].parse(queryStr);
      var entries = params.map(function (key) { var _a; return [key, (_a = query[key]) !== null && _a !== void 0 ? _a : null]; });
      var queryParams = Object.fromEntries(entries);
      var setQueryParams = function (params) {
          var newQuery = Object.assign(query, params);
          var newUrl = window.location.pathname +
              window.location.hash.split("?")[0] +
              "?" +
              qs__default["default"].stringify(newQuery);
          window.history.replaceState({}, "", newUrl);
      };
      return [queryParams, setQueryParams];
  };

  exports.useAutoFontSize = useAutoFontSize;
  exports.useQueryParams = useQueryParams;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.umd.js.map
