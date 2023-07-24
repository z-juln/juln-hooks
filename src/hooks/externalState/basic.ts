import { nanoid } from "nanoid";

// key
const UNKNOWN_KEY_PREFIX = 'externalState-unknown-key__';
export const createUnknownKey = () => UNKNOWN_KEY_PREFIX + nanoid();
