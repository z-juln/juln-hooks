import type { ReactNode } from "react";

/**
 * 数组的item的每个间隔都加入node
 *
 * @example
 * const Tools = [<div />, <div />, <div />];
 *
 * const ToolBar = reactNodeArray_join(Tools, <hr />);
 * // [<div />, <hr />, <div />, <hr />, <div />]
 *
 * // or
 * const ToolBar2 = reactNodeArray_join(Tools, (index, splitIndex) => <hr key={`split-${splitIndex}`} />);
 */
export const reactNodeArray_join = (
  reactNodeArray: ReactNode[],
  /** 一般是无副作用组件 */
  node: ReactNode | ((index: number, splitIndex: number) => ReactNode)
) => {
  const result: ReactNode[] = [];
  let index = 0;
  let splitIndex = 0;
  reactNodeArray.forEach((item, itemIndex) => {
    index++;
    result.push(item);
    // 在除了最后一个元素之后的每个元素之后添加节点
    if (itemIndex < reactNodeArray.length - 1) {
      index++;
      result.push(typeof node === "function" ? node(index, splitIndex) : node);
      splitIndex++;
    }
  });
  return result;
};
