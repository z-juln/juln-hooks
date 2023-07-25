import { expectAssignable, expectError, expectType, printType } from 'tsd';
import { externalState } from '..';
import { SetterOrUpdater } from 'recoil';
import { Dispatch } from '../hooks/externalState/reducer-type';
import { dangerous_externalState } from '../hooks/externalState';

// Dispatch 范型测试
{
  expectType<{
    readonly __dangerouslySet: SetterOrUpdater<any>;
  }>(
    {} as Dispatch<any, any, false>
  );
}

// 无reducer
{
  interface Store {
    userInfo: Record<string, any>;
  }
  const defaultStore: Store = {
    userInfo: {},
  };
  const dangerousReturnType = dangerous_externalState(defaultStore);
  const safeReturnType = externalState(defaultStore);

  type UseState = () => readonly [Store, SetterOrUpdater<Store>];
  type DangerousDispatch = { readonly __dangerouslySet: SetterOrUpdater<Store> };
  type DangerousExternalState = { readonly value: Store };
  type SafeDispatch = {};
  type DangerousReturnType = readonly [UseState, DangerousDispatch, DangerousExternalState];
  type SafeReturnType = readonly [UseState, SafeDispatch];

  // dangerouse
  expectAssignable<DangerousReturnType>(dangerousReturnType);
  expectAssignable<typeof dangerousReturnType>({} as DangerousReturnType);

  // safe
  expectAssignable<SafeReturnType>(safeReturnType);
  expectAssignable<typeof safeReturnType>({} as SafeReturnType);
}

// 有reducer
{
  type CounterAction =
    | "increment"
    | "decrement"
    | { type: "add"; payload: number; }
    | { type: "add&reduce"; payload: 'add' | 'reduce'; };

  const dangerousReturnType = dangerous_externalState<
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
  const safeReturnType = externalState<
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

  type UseState = () => readonly [number, SetterOrUpdater<number>];
  type SafeDispatch = {
    (type: "increment"): void;
    (type: "decrement"): void;
    (type: "add", payload: number): void;
    (type: "add&reduce", payload: 'add' | 'reduce'): void;
  }
  type DangerousDispatch = SafeDispatch & {
    readonly __dangerouslySet: SetterOrUpdater<number>;
  };
  type DangerousExternalState = { readonly value: number };
  type DangerousReturnType = readonly [UseState, DangerousDispatch, DangerousExternalState];
  type SafeReturnType = readonly [UseState, SafeDispatch];

  // dangerouse
  expectAssignable<DangerousReturnType>(dangerousReturnType);
  expectAssignable<typeof dangerousReturnType>({} as DangerousReturnType);

  // safe
  expectAssignable<SafeReturnType>(safeReturnType);
  expectAssignable<typeof safeReturnType>({} as SafeReturnType);
}
