/// <reference types="node" />
import { deserializeUnchecked, serialize, deserialize, Schema } from 'borsh';
export declare const extendBorsh: () => void;
declare type DataConstructor<T, A> = {
    readonly SCHEMA: Schema;
    new (args: A): T;
};
export declare class Data<T = {}> {
    constructor(args?: T);
    static struct<T, A>(this: DataConstructor<T, A>, fields: any): Map<any, any>;
    static serialize<T, A>(this: DataConstructor<T, A>, args?: A): Buffer;
    static deserialize<T, A>(this: DataConstructor<T, A>, data: Buffer): any;
}
export declare const struct: (type: any, fields: any) => Map<any, any>;
export { deserialize, deserializeUnchecked, serialize };
