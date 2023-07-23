import React, { useCallback, useEffect, useMemo } from "react";
import {
  RecoilRoot,
  RecoilRootProps,
  SetterOrUpdater,
  atom,
  useRecoilState,
} from "recoil";
import { nanoid } from "nanoid";
import { Action, Dispatch, Reducer } from "./reducer-type";
import ee from "./event-emit";
import { Writable } from "@juln/type-fest";

type ValOrUpdater<S = unknown> = S | ((currVal: S) => S);

type StateMap = Record<string, any>;

const stateMapAtom = atom<StateMap>({
  key: `externalState/stateMapAtom--${nanoid()}`,
  default: {},
});
const initialStateMap: StateMap = {};

const _ExternalStateRoot: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [stateMap, setStateMap] = useRecoilState(stateMapAtom);

  const setState = useCallback(
    (stateId: string, valOrUpdater: ValOrUpdater) => {
      const NEVER_OLD_STATE = Symbol("never");

      setStateMap((prevStateMap) => {
        const checkUpdateAndEmit = (oldState: any, newState: any): boolean => {
          if (oldState === newState) return false;
          ee.emit("stateUpdate", { stateId, state: newState });
          return true;
        };

        const getReturnedStateMap = (
          oldState: any,
          newState: any
        ): StateMap => {
          const hasUpdate = checkUpdateAndEmit(oldState, newState);
          if (hasUpdate) {
            return {
              ...prevStateMap,
              [stateId]: newState,
            };
          }
          return prevStateMap;
        };

        const hasInitialState = Object.hasOwnProperty.call(
          initialStateMap,
          stateId
        );
        const hasOldState = Object.hasOwnProperty.call(prevStateMap, stateId);

        if (hasOldState) {
          const oldState = prevStateMap[stateId];
          const newState =
            typeof valOrUpdater === "function"
              ? (valOrUpdater as Function)(oldState)
              : valOrUpdater;

          return getReturnedStateMap(oldState, newState);
        } else if (hasInitialState) {
          // 初始化
          const initialState = initialStateMap[stateId];
          delete initialStateMap[stateId];

          const newState = initialState;
          return getReturnedStateMap(NEVER_OLD_STATE, newState);
        } else {
          // 兜底: 不改变
          return prevStateMap;
        }
      });
    },
    []
  );

  useEffect(() => {
    // init
    Object.entries(initialStateMap).forEach(([stateId, initialState]) => {
      setState(stateId, initialState);
    });

    // listener setState
    ee.addListener(
      "setState",
      ({
        stateId,
        valOrUpdater,
      }: {
        stateId: string;
        valOrUpdater: ValOrUpdater;
      }) => {
        setState(stateId, valOrUpdater);
      }
    );

    // listener dispatch
    ee.addListener(
      "dispatch",
      ({
        stateId,
        reducer,
        type,
        payload,
      }: {
        stateId: string;
        reducer: Reducer;
        type: string;
        payload: any;
      }) => {
        setState(stateId, (preState: any) => {
          const newState = reducer(preState, { type, payload });
          return newState;
        });
      }
    );

    return () => {
      ee.removeAllListeners();
      Object.keys(stateMap).forEach((stateId) => {
        delete initialStateMap[stateId];
      });
    };
  }, []);

  return <>{children}</>;
};

const emit_setState = (stateId: string, valOrUpdater: unknown) => {
  ee.emit("setState", { stateId, valOrUpdater });
};

const emit_newState = (stateId: string, initialState: unknown) => {
  initialStateMap[stateId] = initialState;
  emit_setState(stateId, initialState);
};

export const ExternalStateRoot: React.FC<RecoilRootProps> = ({
  children,
  ...restProps
}) => {
  return (
    <RecoilRoot {...restProps}>
      <_ExternalStateRoot>{children}</_ExternalStateRoot>
    </RecoilRoot>
  );
};

type ExternalState<S> = { readonly value: S };

type ExternalStateReturnType<
  S,
  A extends Action,
  HasReducer extends boolean
> = readonly [
  useState: () => readonly [S, SetterOrUpdater<S>],
  dispatch: Dispatch<S, A, HasReducer>,
  __dangerousExternalState: ExternalState<S>
];

function externalState<S = unknown, A extends Action = Action>(
  initialState: S
): ExternalStateReturnType<S, A, false>;
function externalState<S = unknown, A extends Action = Action>(
  initialState: S,
  reducer: Reducer<S, A>
): ExternalStateReturnType<S, A, true>;
function externalState<S = unknown, A extends Action = Action>(
  initialState: S,
  reducer?: Reducer<S, A>
) {
  const stateId = nanoid();

  emit_newState(stateId, initialState);

  const useState = (): readonly [S, SetterOrUpdater<S>] => {
    const [stateMap, setStateMap] = useRecoilState(stateMapAtom);

    const state: S = useMemo(() => {
      return Object.hasOwnProperty.call(initialStateMap, stateId)
        ? initialStateMap[stateId]
        : stateMap[stateId];
    }, [stateMap]);

    const setState: SetterOrUpdater<S> = (valOrUpdater) => {
      setStateMap((prevStateMap) => {
        return {
          ...prevStateMap,
          [stateId]:
            typeof valOrUpdater === "function"
              ? (valOrUpdater as Function)(state)
              : valOrUpdater,
        };
      });
    };

    return [state, setState];
  };

  const setExternalState: SetterOrUpdater<S> = (valOrUpdater) =>
    emit_setState(stateId, valOrUpdater);

  // @ts-ignore
  const dispatch: Dispatch<S, A, true> = reducer
    ? (type: string, payload?: unknown): void => {
        if (!reducer) return;
        ee.emit("dispatch", { stateId, reducer, type, payload });
      }
    : {};

  dispatch.__dangerouslySet = setExternalState;

  const __dangerousExternalState: ExternalState<S> = {
    value: initialState,
  };

  ee.addListener("stateUpdate", ({ stateId: currentStateId, state }) => {
    if (stateId === currentStateId) {
      (__dangerousExternalState as Writable<ExternalState<S>>).value = state;
    }
  });

  return [useState, dispatch, __dangerousExternalState] as const;
}

export default externalState;
