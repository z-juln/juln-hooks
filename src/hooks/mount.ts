import { useEffect, useRef } from "react";

export function useMount(callback: () => void) {
  useEffect(callback, []);
}

export function useUnMount(callback: () => void) {
  useEffect(() => callback, []);
}

export function useCheckUnMounted() {
  const unMountRef = useRef(false);
  useUnMount(() => (unMountRef.current = true));
  return unMountRef.current;
}
