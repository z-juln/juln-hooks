import { TypedRPC } from "@juln/type-fest";
import RPC from "@mixer/postmessage-rpc";

// TODO

class BetterRpc<
  EventMap,
  CallMap,
  Strict extends Boolean = true
  // @ts-ignore
> extends (RPC as TypedRPC<EventMap, CallMap, Strict>) {
  public addListener() {}
  public removeListener() {}
}

interface MyEventMap {
  "load-error": {
    args: [Error];
  };
  close: {};
  result: {
    args: [result1: number, result2: string, result3: null];
  };
}

const rpc = new BetterRpc<MyEventMap, {}, true>();

export default BetterRpc;
