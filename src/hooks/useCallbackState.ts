import { useEffect, useState, useRef } from "react";

export function useCallbackState<T>(initialData: T) {
  type CallBack = (...args: any[]) => any | null;

  const cbRef = useRef<CallBack | null>(null);
  const [data, setData] = useState(initialData);

  useEffect(() => {
    cbRef.current?.(data);
  }, [data]);

  const setState = function (d: T, callback?: CallBack) {
    cbRef.current = callback ?? null;
    setData(d);
  };

  return [data, setState] as const;
}

export default useCallbackState;
