import EventEmitter from "eventemitter3";
import { TypedEventemitter3 } from '@juln/type-fest';
import { Reducer } from "./reducer-type";

type EventMap = {
  "dispatch": {
    args: [
      {
        stateId: string;
        reducer: Reducer<any, any>;
        type: string;
        payload: any;
      },
    ];
  };
  "setState": {
    args: [
      {
        stateId: string;
        valOrUpdater: unknown;
      },
    ];
  };
  "stateUpdate": {
    args: [
      {
        stateId: string;
        state: any;
      },
    ];
  };
};

const ee = new EventEmitter() as TypedEventemitter3<EventMap, true>;

export default ee;
