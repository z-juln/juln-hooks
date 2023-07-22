import { expectError, expectType } from 'tsd';
import { externalState } from '../src';
import { SetterOrUpdater } from 'recoil';
import { Dispatch } from '../src/hooks/externalState/reducer-type';

// Dispatch 范型测试
expectType<{
  __dangerouslySet: SetterOrUpdater<any>;
}>(
  {} as Dispatch<any, any, false>
);

// 无reducer
interface Store {
  userInfo: Record<string, any>;
}
const defaultStore: Store = {
  userInfo: {},
};
const [useStore, storeDispatchMap] = externalState(defaultStore);

expectType<() => readonly [Store, SetterOrUpdater<Store>]>(useStore);
expectType<SetterOrUpdater<Store>>(storeDispatchMap.__dangerouslySet);
expectType<{ __dangerouslySet: SetterOrUpdater<Store>; }>(
  storeDispatchMap
);
// 无reducer时, 不应该为函数
expectType<true>({} as typeof storeDispatchMap extends Function ? false : true);

// 有reducer
type CounterAction =
  | "increment"
  | "decrement"
  | { type: "add"; payload: number; }
  | { type: "add&reduce"; payload: 'add' | 'reduce'; };

const [useCount, counterDispatch] = externalState<
  number,
  CounterAction
>(0, (count, { type, payload }) => {
  switch (type) {
    case "increment":
      return count + 1;
    case "decrement":
      return count - 1;
    case "add":
      return count + payload;
    case "add&reduce":
      return payload === 'add' ? count + 1 : count - 1;
    default:
      return count;
  }
});

expectType<() => readonly [number, SetterOrUpdater<number>]>(useCount);
expectType<SetterOrUpdater<number>>(counterDispatch.__dangerouslySet);

expectError(
  counterDispatch('unknown')
);
expectType<void>(
  counterDispatch('increment')
);
const actionType = 'add';
const errPayload = '';
expectError(
  counterDispatch(actionType, errPayload)
);
