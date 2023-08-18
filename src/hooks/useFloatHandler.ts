import { useEffect, useRef, useState } from "react";

type GetItemOrItem<T> = (() => T) | T;

type ElLick = GetItemOrItem<React.RefObject<HTMLElement> | HTMLElement>;

type UseFloatHandlerOpts = {
  disableHandlerToggle?: boolean;
  disableWindowBlur?: boolean;
};

type UseFloatHandlerReturn = {
  isShow: boolean;
  open: () => void;
  toggle: () => void;
  close: () => void;
};

interface UseFloatHandler {
  ({
    handler,
    float,
    opts,
  }: {
    handler: ElLick;
    float: ElLick;
    opts?: UseFloatHandlerOpts | undefined;
  }): UseFloatHandlerReturn;
  simple: (opts?: UseFloatHandlerOpts) => UseFloatHandlerReturn & {
    handlerRef: React.MutableRefObject<any>;
    floatRef: React.MutableRefObject<any>;
  };
}

/**
 * 处理类似于 `打开弹窗的按钮组件`和`弹窗组件` 的关联
 *
 * @example
 * const App = () => {
 *   const handler = useRef<HTMLButtonElement>(null);
 *   const menu = useRef<HTMLDivElement>(null);
 *   const { isShow: menuIsShow, close: closeMenu, toggle } = useFloatHandler({
 *     handler,
 *     float: menu,
 *     opts: {
 *       disableHandlerToggle: false,
 *       disableWindowBlur: false,
 *     },
 *   });
 *   return (
 *     <>
 *       <button ref={handler}>更多操作</button>
 *       {menuIsShow && (
 *         <div ref={menu}>
 *           菜单
 *           <ul>
 *             <li onClick={() => { console.log('添加'); closeMenu(); }}>添加</li>
 *             <li onClick={() => { console.log('删除'); closeMenu(); }}>删除</li>
 *           </ul>
 *         </div>
 *       )}
 *     </>
 *   );
 * };
 */
const useFloatHandler: UseFloatHandler = ({ handler, float, opts }) => {
  const disableHandlerToggle = opts?.disableHandlerToggle ?? false;
  const disableWindowBlur = opts?.disableWindowBlur ?? false;

  const [isShow, setIsShow] = useState(false);

  const open = () => setIsShow(true);
  const close = () => setIsShow(false);
  const toggle = () => setIsShow((show) => !show);

  const getEl = (elLick: ElLick): HTMLElement | null => {
    const elOrElRef = elLick instanceof Function ? elLick() : elLick;
    return elOrElRef instanceof HTMLElement ? elOrElRef : elOrElRef.current;
  };

  useEffect(() => {
    const onClick = disableHandlerToggle ? open : toggle;
    getEl(handler)?.addEventListener("click", onClick);
    return () => getEl(handler)?.removeEventListener("click", onClick);
  }, [handler, disableHandlerToggle]);

  useEffect(() => {
    if (disableWindowBlur) return;

    const onClick = ({ target }: MouseEvent) => {
      if (!(target instanceof HTMLElement)) return;
      let isBlur = false;
      if (
        !getEl(handler)?.contains(target) &&
        !getEl(float)?.contains(target)
      ) {
        isBlur = true;
      }
      if (isBlur) {
        setIsShow(false);
      }
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [handler, float, disableWindowBlur]);

  return {
    isShow,
    open,
    toggle,
    close,
  };
};

useFloatHandler.simple = (opts) => {
  const handlerRef = useRef<any>(null);
  const floatRef = useRef<any>(null);
  const result = useFloatHandler({
    handler: handlerRef,
    float: floatRef,
    opts,
  });
  return {
    handlerRef,
    floatRef,
    ...result,
  };
};

export default useFloatHandler;
