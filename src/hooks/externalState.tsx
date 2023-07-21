import { useEffect } from "react";
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

const stateMapAtom = atom<Record<string, any>>({
  key: `externalState/stateMapAtom--${nanoid()}`,
  default: {},
});
const ee = new EventEmitter();

const _ExternalStateRoot: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [stateMap, setStateMap] = useRecoilState(stateMapAtom);

  useEffect(() => {
    ee.on(
      "setState",
      ({
        stateId,
        valOrUpdater,
      }: {
        stateId: string;
        valOrUpdater: ValOrUpdater;
      }) => {
        setStateMap((prevStateMap) => {
          const state = prevStateMap[stateId];
          if (!state) return prevStateMap;
          return {
            ...prevStateMap,
            [stateId]:
              typeof valOrUpdater === "function"
                ? (valOrUpdater as Function)(state)
                : valOrUpdater,
          };
        });
      }
    );
    ee.on(
      "newState",
      ({
        stateId,
        initialState,
      }: {
        stateId: string;
        initialState: unknown;
      }) => {
        setStateMap((prevStateMap) => ({
          ...prevStateMap,
          [stateId]: initialState,
        }));
      }
    );
  }, []);

  useEffect(() => {
    ee.emit("stateUpdate", stateMap);
  }, [stateMap]);

  return <>{children}</>;
};

const newState = (stateId: string, initialState: unknown) =>
  ee.emit("newState", { stateId, initialState });

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
  const stateAtom = atom({
    key: stateId,
    default: initialState,
  });

  newState(stateId, initialState);

  const useState = () => useRecoilState(stateAtom);

  const setExternalState: SetterOrUpdater<S> = (valOrUpdater) =>
    ee.emit("setState", { stateId, valOrUpdater });

  return [useState, setExternalState] as const;
};

export default externalState;
