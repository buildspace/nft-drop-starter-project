/// <reference types="node" />
import { Idl, IdlEvent } from "../idl";
import { Event } from "../program/event";
export declare class EventCoder {
    /**
     * Maps account type identifier to a layout.
     */
    private layouts;
    /**
     * Maps base64 encoded event discriminator to event name.
     */
    private discriminators;
    constructor(idl: Idl);
    decode<E extends IdlEvent = IdlEvent, T = Record<string, never>>(log: string): Event<E, T> | null;
}
export declare function eventDiscriminator(name: string): Buffer;
//# sourceMappingURL=event.d.ts.map