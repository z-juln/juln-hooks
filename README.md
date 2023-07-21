# juln-hooks

juln 自己的 hooks 和 react-help 集合（已完全支持 tree-shaking）

## 通用 hooks

### useMount

略

### useUnMount

略

### useCheckUnMounted

检测此时组件是否被卸载, 通常用于对异步事件的处理

如: 组件卸载时, 异步操作的中断处理

### useIsBrowser

用于 ssr 如 next.js, 判断当前是浏览器环境还是 node.js 环境

### externalState

支持外部 setState 的操作

基于 recoil 实现, 所以使用前需要需要 `npm i recoil -S`

如果项目中已经使用了 recoil, 可以直接把 RecoilRoot 替换成 ExternalRoot

**_注: 项目中只能出现一个 RecoilRoot 或者 ExternalRoot_**

App.tsx

```jsx
import Counter from "./Counter";

const App = () => {
  return (
    <ExternalRoot>
      <Counter />
    </ExternalRoot>
  );
};
```

Counter.tsx

```jsx
import { externalState, ExternalStateRoot } from "juln-hooks";

const [useCount, setExternalCount] = externalState<number>();

const Counter = () => {
  const [count, setCount] = useCount(0);
  return (
    <>
      <p>count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>increment</button>
    </>
  );
};

export const increment = () => setExternalCount((c) => c + 1);

export default Counter;
```

### useQueryParams

```jsx
import { useAutoFontSize } from "juln-hooks";

const ScheduleDetailPage = () => {
  const [queryParams, setQueryParams] = useQueryParams(["id", "time"]);

  return (
    <>
      <p>id: {queryParams.id}</p>
      <p>time: {queryParams.time}</p>
      <p onClick={() => setQueryParams({ time: "20220109" })}>
        set time = 20220109
      </p>
    </>
  );
};

export default ScheduleDetailPage;
```

## 特殊 hooks

### useAutoFontSize

文字超出容器时，追加一个 className

```jsx
import React, { useRef, memo } from "react";
import { useAutoFontSize } from "juln-hooks";
import style from "./index.less";

const AutoFontSizeContainer = ({
  tag: Tag,
  children,
}: {
  tag: keyof JSX.IntrinsicElements;
  children: string;
}) => {
  const textRef = useRef<HTMLElement>(null);
  useAutoFontSize(textRef, style.overflow);
  return (
    <Tag className={style.container} ref={textRef}>
      {children}
    </Tag>
  );
};

export default memo(AutoFontSizeContainer) as typeof AutoFontSizeContainer;
```

```less
// index.less
.container {
  font-size: 16px;
  color: black;
  &.overflow {
    font-size: 12px;
    color: red;
  }
}
```

## 通用 react-help

### reactNodeArray_join

在 ReactNode 数组的 item 的每个间隔都加入 node
