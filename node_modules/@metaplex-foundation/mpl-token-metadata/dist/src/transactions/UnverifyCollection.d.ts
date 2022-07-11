import { Borsh, Transaction } from '@metaplex-foundation/mpl-core';
import { PublicKey, TransactionCtorFields } from '@solana/web3.js';
export declare class UnVerifyCollectionArgs extends Borsh.Data {
    static readonly SCHEMA: any;
    instruction: number;
}
declare type UnVerifyCollectionParams = {
    metadata: PublicKey;
    collectionAuthorityRecord?: PublicKey;
    collectionAuthority: PublicKey;
    collectionMint: PublicKey;
    collectionMetadata: PublicKey;
    collectionMasterEdition: PublicKey;
};
export declare class UnVerifyCollection extends Transaction {
    constructor(options: TransactionCtorFields, params: UnVerifyCollectionParams);
}
export {};
