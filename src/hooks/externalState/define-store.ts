import { atom, useRecoilState, AtomOptions as RecoilAtomOptions, SetterOrUpdater } from "recoil";
import { SetOptional } from "@juln/type-fest";
import { createUnknownKey } from "./basic";

export type Ctx<T> = {
  useState: () => readonly [T, SetterOrUpdater<T>];
};

export type AtomOptions<T> = SetOptional<RecoilAtomOptions<T>, 'key'>;

export interface DefineStore<T> {
  <R>(atomOpts: AtomOptions<T>, getExpose: (ctx: Ctx<T>) => R): () => R;
}

/**
 * @example
 * // ./store/counter.ts
 * const useCounterStore = defineStore(
 *   // recoil atom的配置... 更多请看 https://recoiljs.org/
 *   {
 *    default: 0,
 *   },
 *   // expose state and dispatches
 *   ({ useState }) => {
 *     const [count, setCount] = useState();
 *     const doubleCount = useMemo(() => count * 2, [count]);
 *     const increment = () => setCount(c => c + 1);
 *     return {
 *       count,
 *       doubleCount,
 *       increment,
 *     };
 *   },
 * );
 * // ./pages/home.tsx
 * const { count, doubleCount, increment } = useCounterStore();
 */
export const defineStore = <T, R>(atomOpts: AtomOptions<T>, getExpose: (ctx: Ctx<T>) => R): () => R => {
  const key = atomOpts?.key ?? createUnknownKey();
  const recoilState = atom({
    ...atomOpts,
    key,
  });
  const ctx: Ctx<T> = {
    useState: () => useRecoilState(recoilState),
  };
  return () => getExpose(ctx);
};

/**
 * 提供更好的类型提示
 * 
 * @example
 * type Store = { xxx: xxx };
 * const defineStore = typedDefineStore<Store>();
 * const useStore = defineStore(...);
 */
export function typedDefineStore<T>(): DefineStore<T>;
export function typedDefineStore<T>() {
  return () => defineStore as any;
}
