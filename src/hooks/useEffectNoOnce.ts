import { useEffect, useRef } from "react";

/** 首次useEffect不执行 */
export const useEffectNoOnce: typeof useEffect = (effect, deps) => {
  const canEffect = useRef(false);
  useEffect(() => {
    if (!canEffect.current) {
      canEffect.current = true;
      return;
    }
    if (canEffect.current) {
      effect();
    }
  }, deps);
};

export default useEffectNoOnce;
