import {
  useState,
  useRef,
  Dispatch,
  SetStateAction,
  useEffect,
  useCallback,
} from "react";
import { debounce, throttle } from "throttle-debounce";

const getUseThrottleOrDebounceState = (
  mode: "throttle" | "debounce" = "debounce"
) => {
  const throttleOrDebounceFn = mode === "debounce" ? debounce : throttle;

  function useDebounceState<S = undefined>(): [
    S | undefined,
    Dispatch<SetStateAction<S | undefined>>
  ];
  function useDebounceState<S = undefined>(
    timestamp: number
  ): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
  function useDebounceState<S>(
    timestamp: number,
    initialState: S | (() => S)
  ): [S, Dispatch<SetStateAction<S>>];
  function useDebounceState(timestamp = 1000, initialState?: any) {
    const realStateRef = useRef(
      typeof initialState === "function" ? initialState() : initialState
    );
    const [debouncedState, setDebouncedState] = useState(initialState);

    const setState: Dispatch<SetStateAction<any>> = useCallback(
      (valOrGetVal) => {
        const newVal =
          typeof valOrGetVal === "function"
            ? valOrGetVal(realStateRef.current)
            : valOrGetVal;
        realStateRef.current = newVal;
      },
      [realStateRef]
    );

    useEffect(() => {
      const { cancel } = throttleOrDebounceFn(timestamp ?? 1000, () =>
        setDebouncedState(realStateRef.current)
      );
      return cancel;
    }, [timestamp]);

    return [debouncedState, setState];
  }

  return useDebounceState;
};

export const useDebounceState = getUseThrottleOrDebounceState("debounce");
export const useThrottleState = getUseThrottleOrDebounceState("throttle");
