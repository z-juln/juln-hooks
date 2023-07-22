import React, { useCallback, useEffect, useMemo } from "react";
import EventEmitter from "eventemitter3";
import {
  RecoilRoot,
  RecoilRootProps,
  SetterOrUpdater,
  atom,
  useRecoilState,
} from "recoil";
import { nanoid } from "nanoid";
import { Action, Dispatch, Reducer } from "./reducer";

type ValOrUpdater<S = unknown> = S | ((currVal: S) => S);

type StateMap = Record<string, any>;

const stateMapAtom = atom<StateMap>({
  key: `externalState/stateMapAtom--${nanoid()}`,
  default: {},
});
const ee = new EventEmitter();
const initialStateMap: StateMap = {};

const _ExternalStateRoot: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [stateMap, setStateMap] = useRecoilState(stateMapAtom);

  const setState = useCallback(
    (stateId: string, valOrUpdater: ValOrUpdater) => {
      setStateMap((prevStateMap) => {
        let newStateMap: StateMap;
        const hasState = Object.hasOwnProperty.call(prevStateMap, stateId);
        const initialState = initialStateMap[stateId];
        if (!hasState && initialState) {
          const initialState = initialStateMap[stateId];
          delete initialStateMap[stateId];
          newStateMap = {
            ...prevStateMap,
            [stateId]: initialState,
          };
        } else if (!hasState) {
          newStateMap = prevStateMap;
        } else {
          newStateMap = {
            ...prevStateMap,
            [stateId]:
              typeof valOrUpdater === "function"
                ? (valOrUpdater as Function)(prevStateMap[stateId])
                : valOrUpdater,
          };
        }
        return newStateMap;
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

const emit_dispatch = (
  stateId: string,
  reducer: Reducer<any, any>,
  type: string,
  payload: any
) => {
  ee.emit("dispatch", { stateId, reducer, type, payload });
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

function externalState<S = unknown, A extends Action = Action>(
  initialState: S
): readonly [() => readonly [S, SetterOrUpdater<S>], Dispatch<S, A, false>];
function externalState<S = unknown, A extends Action = Action>(
  initialState: S,
  reducer?: Reducer<S, A>
): readonly [() => readonly [S, SetterOrUpdater<S>], Dispatch<S, A, true>];
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
        emit_dispatch(stateId, reducer, type, payload);
      }
    : {};

  dispatch.__dangerouslySet = setExternalState;

  return [useState, dispatch] as const;
}

export default externalState;
