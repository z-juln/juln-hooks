import React, { useEffect } from 'react';

const useAutoFontSize = (
  elRef: React.RefObject<HTMLElement>,
  /** 溢出时元素的className */
  cbClassName: string,
) => {
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    if (el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth) {
      el.classList.add(cbClassName);
    } else {
      el.classList.remove(cbClassName);
    }
  }, [elRef.current]);
};

export default useAutoFontSize;
