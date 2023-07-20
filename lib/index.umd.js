(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('eventemitter3')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react', 'eventemitter3'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["juln-hooks"] = {}, global.react, global.EventEmitter));
})(this, (function (exports, react, EventEmitter) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var EventEmitter__default = /*#__PURE__*/_interopDefaultLegacy(EventEmitter);

  var useMount = function (callback) { return react.useEffect(callback, []); };
  var useUnMount = function (callback) { return react.useEffect(function () { return callback; }, []); };
  /** 检测此时组件是否被卸载, 通常用于对异步事件的处理 */
  var useCheckUnMounted = function () {
      var unMountRef = react.useRef(false);
      useUnMount(function () { return (unMountRef.current = true); });
      return unMountRef.current;
  };

  var EVENT_NAME = 'setExternalState';
  var externalState = function () {
      var ee = new EventEmitter__default["default"]();
      // @ts-ignore
      var useState = function (initialState) {
          var _a = react.useState(initialState), count = _a[0], setCount = _a[1];
          react.useEffect(function () {
              var listener = setCount;
              ee.on(EVENT_NAME, listener);
              return function () {
                  ee.off(EVENT_NAME, listener);
              };
          }, []);
          return [count, setCount];
      };
      var setExternalState = function (arg) { return ee.emit(EVENT_NAME, arg); };
      return [
          useState,
          setExternalState,
      ];
  };

  var useAutoFontSize = function (elRef, 
  /** 溢出时元素的className */
  cbClassName) {
      react.useEffect(function () {
          var el = elRef.current;
          if (!el)
              return;
          if (el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth) {
              el.classList.add(cbClassName);
          }
          else {
              el.classList.remove(cbClassName);
          }
      }, [elRef.current]);
  };

  exports.externalState = externalState;
  exports.useAutoFontSize = useAutoFontSize;
  exports.useCheckUnMounted = useCheckUnMounted;
  exports.useMount = useMount;
  exports.useUnMount = useUnMount;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.umd.js.map
