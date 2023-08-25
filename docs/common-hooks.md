# 通用 hooks

## useMount

略

## useUnMount

略

## useCheckUnMounted

检测此时组件是否被卸载, 通常用于对异步事件的处理

如: 组件卸载时, 异步操作的中断处理

## useIsBrowser

用于 ssr 如 next.js, 判断当前是浏览器环境还是 node.js 环境, 一般用于写支持 ssr 的通用组件库 (直接使用 `typeof window !== 'undefined'` 反而会缺失数据的响应)

## useDebounceState

`useDebounceState(?timestamp = 1000, ?initialState);`

连续 setState 时, state 值的变化是防抖的, 以此减少 render 次数

默认防抖间隔为 1000ms

```typescript
const [state, setState] = useDebounceState(1000, "");

// typescript的五种不同使用方式
useDebounceState();
useDebounceState(1000);
useDebounceState<string>(1000);
useDebounceState(1000, "");
useDebounceState(1000, () => "");
```

## useThrottleState

节流, 同 useDebounceState
