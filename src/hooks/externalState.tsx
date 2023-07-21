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

    // listener
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
    return () => {
      ee.removeAllListeners();
      Object.keys(stateMap).forEach((stateId) => {
        delete initialStateMap[stateId];
      });
    };
  }, []);

  return <>{children}</>;
};

const setState = (stateId: string, valOrUpdater: unknown) => {
  ee.emit("setState", { stateId, valOrUpdater });
};

const newState = (stateId: string, initialState: unknown) => {
  initialStateMap[stateId] = initialState;
  setState(stateId, initialState);
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

const externalState = <S = unknown,>(initialState: S) => {
  const stateId = nanoid();

  newState(stateId, initialState);

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
    setState(stateId, valOrUpdater);

  return [useState, setExternalState] as const;
};

export default externalState;
