# 特殊 hooks

## useLockRatio

同时输入宽与高, 支持锁住宽高比例进行修改

```jsx
import { useLockRatio } from "juln-hooks";

const SizeBox = () => {
  const {
    inputedSize,
    dangerouslySetInputedSize,
    cleanInputedSize,
    onChange,
    lockedRatioStatus,
    lock,
    unlock,
  } = useLockRatio();
  return (
    <div>
      width:
      <input
        value={inputedSize.w}
        onInput={(e) => onChange(e.currentTarget.value, "w")}
      />
      height:
      <input
        value={inputedSize.h}
        onInput={(e) => onChange(e.currentTarget.value, "h")}
      />
      <button onClick={lockedRatioStatus.active ? unlock : lock}>
        {lockedRatioStatus.active ? "unlock" : "lock"} ratio
      </button>
    </div>
  );
};

export default SizeBox;
```

## useAutoFontSize

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

export default AutoFontSizeContainer;
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
