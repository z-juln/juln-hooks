# 通用 react-help

## reactNodeArray_join

在 ReactNode 数组的 item 的每个间隔都加入 node

```tsx
import React from "react";
import { reactNodeArray_join } from "juln-hooks";

const Tools = [<div />, <div />, <div />];

const ToolBar = reactNodeArray_join(Tools, <hr />);
// [<div />, <hr />, <div />, <hr />, <div />]
```
