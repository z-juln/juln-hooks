import { useEffect, useRef, useState } from 'react';
import EventEmitter from 'eventemitter3';

var useMount = function (callback) { return useEffect(callback, []); };
var useUnMount = function (callback) { return useEffect(function () { return callback; }, []); };
/** 检测此时组件是否被卸载, 通常用于对异步事件的处理 */
var useCheckUnMounted = function () {
    var unMountRef = useRef(false);
    useUnMount(function () { return (unMountRef.current = true); });
    return unMountRef.current;
};

var EVENT_NAME = 'setExternalState';
var externalState = function () {
    var ee = new EventEmitter();
    // @ts-ignore
    var useState$1 = function (initialState) {
        var _a = useState(initialState), count = _a[0], setCount = _a[1];
        useEffect(function () {
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
        useState$1,
        setExternalState,
    ];
};

var useAutoFontSize = function (elRef, 
/** 溢出时元素的className */
cbClassName) {
    useEffect(function () {
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

export { externalState, useAutoFontSize, useCheckUnMounted, useMount, useUnMount };
//# sourceMappingURL=index.es.js.map
