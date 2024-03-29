// externalState
export {
  ExternalStateRoot,
  default as externalState,
  dangerous_externalState,
} from "./hooks/externalState";
export { defineStore } from "./hooks/externalState/define-store";

// hooks
export {
  useMount,
  useUnMount,
  useCheckUnMounted,
  useIsBrowser,
} from "./hooks/mount";
export {
  useDebounceState,
  useThrottleState,
} from "./hooks/useThrottleOrDebounceState";
export { default as useLockRatio } from "./hooks/useLockRatio";
export { default as useFloatHandler } from "./hooks/useFloatHandler";
export { default as useAutoFontSize } from "./hooks/useAutoFontSize";

// react-help
export { reactNodeArray_join } from "./react-help/reactNode";
