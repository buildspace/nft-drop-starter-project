import { Borsh } from '@metaplex-foundation/mpl-core';
import { MetadataKey, UseMethod } from '.';
declare type UsesArgs = {
    useMethod: UseMethod;
    total: number;
    remaining: number;
};
export declare class Uses extends Borsh.Data<UsesArgs> {
    static readonly SCHEMA: any;
    useMethod: UseMethod;
    total: number;
    remaining: number;
    constructor(args: UsesArgs);
}
declare type UseAuthorityRecordArgs = {
    allowedUses: number;
    bump: number;
};
export declare class UseAuthorityRecord extends Borsh.Data<UseAuthorityRecordArgs> {
    static readonly SCHEMA: any;
    key: MetadataKey;
    allowedUses: number;
    bump: number;
    constructor(args: UseAuthorityRecordArgs);
}
export {};
