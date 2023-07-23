import { UnionToIntersection } from "@juln/type-fest";
import { SetterOrUpdater } from "recoil";

type ComplexAction<Type = string, Payload = unknown> = {
  type: Type;
  payload: Payload;
};

export type Action = string | ComplexAction;

export type Reducer<S = unknown, A extends Action = Action> = (
  prevState: S,
  action: A extends ComplexAction ? A : { type: A; payload?: void }
) => S;

type ActionToDispatch<A extends Action> =
  A extends ComplexAction<infer T, infer P>
    ? {
        (type: T, payload: P): void;
      }
    : A extends string
      ? {
          (type: A): void;
        }
      : never;

type Dispatch_without_dangerouslySet<A extends Action> = UnionToIntersection<
  ActionToDispatch<A>
>;

export type Dispatch<
  S = unknown,
  A extends Action = Action,
  HasReducer = false,
  Strict extends boolean = false
> = (HasReducer extends true ? Dispatch_without_dangerouslySet<A> : {}) & (Strict extends true ? {} : {
  readonly __dangerouslySet: SetterOrUpdater<S>;
});
