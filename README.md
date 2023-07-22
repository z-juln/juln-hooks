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

支持组件外部控制组件内部的状态 (首推 reducer 的操作方式)

目的: externalState 的目的是为了减轻大项目中的 store

特点:

1. 便于极大减轻大项目中的 store
2. 方便使用, 上手难度低
3. 支持超强的 ts 类型提示, dispatch 的任何参数都能得到最严格的约束

适用于哪些 state: 有些状态只是用于简单的组件穿透的, 逻辑上并不属于 store, 如一个 Modal，很多地方都能去控制它, 但是逻辑上不应该属于 store

基于 [`recoil`](https://www.npmjs.com/package/recoil) 实现, 所以使用前需要额外安装 `recoil`: `npm i recoil -S`

如果项目中已经使用了 `recoil`, 直接用 ExternalRoot 替换 RecoilRoot

./app.tsx

```jsx
import Counter from "./counter";

const App = () => {
  return (
    <ExternalRoot>
      <Counter />
    </ExternalRoot>
  );
};
```

./counter.tsx (使用 reducer)

```jsx
import { externalState, ExternalStateRoot } from "juln-hooks";

type CounterAction =
  | "increment"
  | "decrement"
  | { type: "add"; payload: number; }
  | { type: "undo&do"; payload: 'undo' | 'do'; };

const [useCount, _counterDispatchMap] = externalState<
  number,
  CounterAction,
>(0, (count, { type, payload }) => {
  switch (type) {
    case "increment":
      return count + 1;
    case "decrement":
      return count - 1;
    case "add":
      return count + payload;
    case "undo&do":
      return payload === 'undo' ? xxx : xxx;
    default:
      return count;
  }
});

const Counter = () => {
  const [count, setCount] = useCount(0);
  return (
    <>
      <p>count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>increment</button>
    </>
  );
};

// 推荐使用reducer定义的操作
export const counterDispatchMap = _counterDispatchMap;

// 不推荐使用 dispatchMap.__dangerouslySet
export const increment = () =>
  _counterDispatchMap.__dangerouslySet((c) => c + 1);

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
