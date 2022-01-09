import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import qs from 'qs';

var useAutoFontSize = function (elRef, cbClassName // 溢出时元素的className
) {
    useEffect(function () {
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
    var location = useLocation();
    var queryStr = location.search.split("?")[1];
    var query = qs.parse(queryStr);
    var entries = params.map(function (key) { var _a; return [key, (_a = query[key]) !== null && _a !== void 0 ? _a : null]; });
    var queryParams = Object.fromEntries(entries);
    var setQueryParams = function (params) {
        var newQuery = Object.assign(query, params);
        var newUrl = window.location.pathname +
            window.location.hash.split("?")[0] +
            "?" +
            qs.stringify(newQuery);
        window.history.replaceState({}, "", newUrl);
    };
    return [queryParams, setQueryParams];
};

export { useAutoFontSize, useQueryParams };
//# sourceMappingURL=index.es.js.map
