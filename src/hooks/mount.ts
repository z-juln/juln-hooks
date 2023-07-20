import { useEffect, useRef, useState } from "react";

export const useMount = (callback: () => void) => useEffect(callback, []);

export const useUnMount = (callback: () => void) => useEffect(() => callback, []);

/** 检测此时组件是否被卸载, 通常用于对异步事件的处理 */
export const useCheckUnMounted = () => {
  const unMountRef = useRef(false);
  useUnMount(() => (unMountRef.current = true));
  return unMountRef.current;
};

/** 用于ssr如next.js, 判断当前是浏览器环境还是node.js环境 */
export const useIsBrowser = () => {
  const [isBrowser, setIsBrowser] = useState(false);
  useEffect(() => {
    setIsBrowser(true);
  }, []);
  return isBrowser;
};
