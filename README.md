# juln-hooks

自己的 hooks 集合 (支持 tree-shaking)

## 通用

## useMount

## useUnMount

## useCheckUnMounted

### externalState

在 useState 的基础上做封装, 支持外部 setState 的操作

```jsx
import { externalState } from "juln-hooks";

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
import React, { memo } from "react";
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

export default memo(ScheduleDetailPage);
```

## 特殊

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
