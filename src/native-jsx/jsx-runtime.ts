/** https://babeljs.io/docs/babel-plugin-transform-react-jsx */

import { createElement } from ".";

export const jsxs = (tag: any, { children, ...restProps }: any) => createElement(tag, restProps, ...children);

export const jsx = jsxs;
