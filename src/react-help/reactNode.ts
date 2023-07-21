import type { ReactNode } from 'react';

/** 数组的item的每个间隔都加入node */
export const reactNodeArray_join = (
  reactNodeArray: ReactNode[],
  /** 一般是无副作用组件 */
  node: ReactNode,
): ReactNode[] => {
  const result: ReactNode[] = [];

  reactNodeArray.forEach((item, index) => {
    result.push(item);

    // 在除了最后一个元素之后的每个元素之后添加节点
    if (index < reactNodeArray.length - 1) {
      result.push(node);
    }
  });

  return result;
};
