# externalState

支持组件外部控制组件内部的状态 (首推 reducer 的操作方式)

目的: externalState 的目的是为了减轻大项目中的 store

特点:

1. 便于极大减轻大项目中的 store
2. 方便使用, 上手难度低
3. 支持超强的 ts 类型提示, dispatch 的任何参数都能得到最严格的约束

适用于哪些 state: 有些状态只是用于简单的组件穿透的, 逻辑上并不属于 store, 如一个 Modal，很多地方都能去控制它, 但是逻辑上不应该属于 store

基于 [`recoil`](https://recoiljs.org/) 实现, 所以使用前需要额外安装 `recoil`: `npm i recoil -S`

如果项目中已经使用了 `recoil`, 直接用 ExternalRoot 替换 RecoilRoot

./app.tsx

```jsx
import { ExternalStateRoot } from "juln-hooks";
import Counter from "./counter";

const App = () => {
  return (
    <ExternalRoot>
      <Counter />
    </ExternalRoot>
  );
};
```

./counter.tsx

```jsx
// 推荐使用externalState而不是dangerous_externalState, dangerous_externalState会暴露出一些不合理的api
import { dangerous_externalState, externalState } from "juln-hooks";

type CounterAction =
  | "increment"
  | "decrement"
  | { type: "add"; payload: number; }
  | { type: "undo&do"; payload: 'undo' | 'do'; };

// 使用externalState时, 没有第三个参数__dangerousExternalCount
const [useCount, _counterDispatch, __dangerousExternalCount] = dangerous_externalState<
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

// 外部可访问(只读), 不推荐使用!!!
console.log('count', __dangerousExternalCount.value);

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
export const counterDispatch = _counterDispatch;

// 绕过reducer直接设置, 不推荐使用!!!
// 使用externalState时, 不会暴露出__dangerouslySet这个api
export const increment = () =>
  _counterDispatch.__dangerouslySet((c) => c + 1);

export default Counter;
```

外部.ts

```js
import { counterDispatch } from './counter';

// diaptch用法如下
// 有严格的类型校验, type字符串会提示, 打错了报错, 参数数量和参数类型与当前type对应不上都会报错
counterDispatch('increment');
counterDispatch('add', 100);
...
```
