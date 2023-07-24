# native-jsx

将 jsx 编译成 document.createElement

## 用法 1: tsc

tsconfig.json

```json
{
  "compilerOptions": {
    "jsx": "react"
    // ...
  }
  // ...
}
```

代码

```tsx
import * as React from "juln-hooks/native-jsx";

const MyNode = <span>xxx</span>;
const Comp = ({ text, children }: { text: string; children?: any }) => (
  <span>
    {text}
    {children}
  </span>
);
export const Test = (
  <>
    <div className="test-container" style={{ backgroundColor: "red" }}>
      <p>test</p>
      {MyNode}
      <input type="checkbox" checked />
      <Comp text="xxx" />
    </div>
  </>
);
```

打包: tsc

输出结果:

```js
import * as React from "./native-jsx";
var MyNode = React.createElement("span", null, "xxx");
var Comp = function (_a) {
  var text = _a.text,
    children = _a.children;
  return React.createElement("span", null, text, children);
};
export var Test = React.createElement(
  React.Fragment,
  null,
  React.createElement(
    "div",
    { className: "test-container", style: { backgroundColor: "red" } },
    React.createElement("p", null, "test"),
    MyNode,
    React.createElement("input", { type: "checkbox", checked: true }),
    React.createElement(Comp, { text: "xxx" })
  )
);
```

## 用法 2: [babel-plugin-transform-react-jsx](https://babeljs.io/docs/babel-plugin-transform-react-jsx) classic 模式

```tsx
/** @jsxRuntime classic */
import * as React from "juln-hooks/native-jsx";

const profile = (
  <div>
    <img src="avatar.png" className="profile" />
    <h3>{[user.firstName, user.lastName].join(" ")}</h3>
  </div>
);
```

输出结果: 同用法 1

## 用法 3: [babel-plugin-transform-react-jsx](https://babeljs.io/docs/babel-plugin-transform-react-jsx) custom-jsx-library 模式

```tsx
/** @jsxImportSource custom-jsx-library */
import * as React from "juln-hooks/native-jsx";

const profile = (
  <div>
    <img src="avatar.png" className="profile" />
    <h3>{[user.firstName, user.lastName].join(" ")}</h3>
  </div>
);
```

输出结果:

```tsx
import { jsx as _jsx } from "juln-hooks/native-jsx/jsx-runtime";
import { jsxs as _jsxs } from "juln-hooks/native-jsx/jsx-runtime";

const profile = _jsxs("div", {
  children: [
    _jsx("img", {
      src: "avatar.png",
      className: "profile",
    }),
    _jsx("h3", {
      children: [user.firstName, user.lastName].join(" "),
    }),
  ],
});
```
