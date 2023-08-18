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
      {!!lockedRatioStatus.active && <p>current ratio: {lockedRatioStatus.ratio}</p>}
    </div>
  );
};

export default SizeBox;
```

## useFloatHandler

处理类似于 `打开弹窗的按钮组件`和`弹窗组件` 的关联

```jsx
import React, { useRef } from "react";
import { useFloatHandler } from "juln-hooks";

const App = () => {
  const handler = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const {
    isShow: menuIsShow,
    close: closeMenu,
    toggle,
  } = useFloatHandler({
    handler,
    float: menu,
    opts: {
      /** handler不使用toggle模式, 点击时只负责打开float */
      disableHandlerToggle: false,
      /** 窗口失焦时, 不关闭float */
      disableWindowBlur: false,
    },
  });
  return (
    <>
      <button ref={handler}>更多操作</button>
      <div ref={menu}>
        菜单
        <ul>
          <li
            onClick={() => {
              // TODO
              closeMenu();
            }}
          >
            添加
          </li>
          <li
            onClick={() => {
              // TODO
              closeMenu();
            }}
          >
            删除
          </li>
        </ul>
      </div>
    </>
  );
};
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
