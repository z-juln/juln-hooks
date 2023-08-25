# juln-hooks

实用的 react-hooks 和 react-help 集合（已完全支持 tree-shaking）

可以算是对 [ahooks](https://ahooks.js.org/) 的补充, 建议两者结合使用, 需要哪些用哪些

## 安装

`npm i juln-hooks -S` or `yarn add juln-hooks -S`

## [通用 hooks](/docs/common-hooks.md)

### useMount

### useUnMount

### useCheckUnMounted

### useIsBrowser

### useDebounceState

### useThrottleState

## [defineStore](/docs/define-store.md)

基于 [`recoil`](https://recoiljs.org/), 更舒服的编写 store

## [externalState](/docs/external-state.md)

支持组件外部控制组件内部的状态 (首推 reducer 的操作方式)

目的: externalState 的目的是为了减轻大项目中的 store

特点:

1. 便于极大减轻大项目中的 store
2. 方便使用, 上手难度低
3. 支持超强的 ts 类型提示, dispatch 的任何参数都能得到最严格的约束

适用于哪些 state: 有些状态只是用于简单的组件穿透的, 逻辑上并不属于 store, 如一个 Modal，很多地方都能去控制它, 但是逻辑上不应该属于 store

## [通用 react-help](/docs/react-help.md)

### reactNodeArray_join

## [native-jsx](/docs/native-jsx.md)

将 jsx 编译成 document.createElement

## [特殊 hooks](/docs/other-hooks.md)

### useLockRatio

### useFloatHandler

### useAutoFontSize
