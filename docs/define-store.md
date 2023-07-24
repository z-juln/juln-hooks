# defineStore

基于 [`recoil`](https://recoiljs.org/), 更舒服的编写 store

基础用法

```jsx
// ./store/counter.ts
import { defineStore } from "juln-hooks";

const useCounterStore = defineStore(
  // recoil atom的配置... 更多请看 https://recoiljs.org/
  {
    default: 0,
  },
  // expose state and dispatches
  ({ useState }) => {
    const [count, setCount] = useState();
    const doubleCount = useMemo(() => count * 2, [count]);
    const increment = () => setCount((c) => c + 1);
    return {
      count,
      doubleCount,
      increment,
    };
  }
);
export default useCounterStore;

// ./pages/home.tsx
import useCounterStore from "./store/counter.ts";
const { count, doubleCount, increment } = useCounterStore();
```

获得更好的类型提示

```ts
import { typedDefineStore, defineStore } from "juln-hooks";

type Store = { xxx: xxx };
const defineStore = typedDefineStore<Store>();
const useStore = defineStore(...);
```
