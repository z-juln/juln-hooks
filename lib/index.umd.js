(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global["juln-hooks"] = factory());
})(this, (function () { 'use strict';

    var text = 'hello world';
    console.log(text);
    var getText = function () {
        return text;
    };

    return getText;

}));
//# sourceMappingURL=index.umd.js.map
