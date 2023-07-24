# 通用 hooks

## useMount

略

## useUnMount

略

## useCheckUnMounted

检测此时组件是否被卸载, 通常用于对异步事件的处理

如: 组件卸载时, 异步操作的中断处理

## useIsBrowser

用于 ssr 如 next.js, 判断当前是浏览器环境还是 node.js 环境

## useQueryParams

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
