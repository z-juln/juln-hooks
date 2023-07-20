import { Dispatch, SetStateAction, useEffect, useState as useReactState } from "react";
import EventEmitter from 'eventemitter3';

const EVENT_NAME = 'setExternalState';

type UseState<S> = (initialState: S | (() => S)) => [S, Dispatch<SetStateAction<S>>];
type SetState<S> = Dispatch<SetStateAction<S>>;

const externalState = <S = unknown>() => {
  const ee = new EventEmitter();

  // @ts-ignore
  const useState: UseState<S> = (initialState) => {
    const [count, setCount] = useReactState<S>(initialState);
    useEffect(() => {
      const listener = setCount;
      ee.on(EVENT_NAME, listener);
      return () => {
        ee.off(EVENT_NAME, listener);
      };
    }, []);
    return [count, setCount] as const;
  };

  const setExternalState: SetState<S> = (arg) => ee.emit(EVENT_NAME, arg);

  return [
    useState,
    setExternalState,
  ] as const;
};

export default externalState;
