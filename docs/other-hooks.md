# 特殊 hooks

# useAutoFontSize

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
