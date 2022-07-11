import { Borsh, StringPublicKey } from '@metaplex-foundation/mpl-core';
import { MetadataKey } from './constants';
declare type Args = {
    key: StringPublicKey;
    verified: boolean;
};
export declare class Collection extends Borsh.Data<Args> {
    static readonly SCHEMA: any;
    key: StringPublicKey;
    verified: boolean;
    constructor(args: Args);
}
declare type CollectionAuthorityRecordArgs = {
    bump: number;
};
export declare class CollctionAuthorityRecord extends Borsh.Data<CollectionAuthorityRecordArgs> {
    static readonly SCHEMA: any;
    key: MetadataKey;
    bump: number;
    constructor(args: CollectionAuthorityRecordArgs);
}
export {};
