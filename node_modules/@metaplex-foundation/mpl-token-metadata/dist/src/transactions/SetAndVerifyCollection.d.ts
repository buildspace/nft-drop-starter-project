import { Borsh, Transaction } from '@metaplex-foundation/mpl-core';
import { PublicKey, TransactionCtorFields } from '@solana/web3.js';
export declare class SetAndVerifyCollectionArgs extends Borsh.Data {
    static readonly SCHEMA: any;
    instruction: number;
}
declare type SetAndVerifyCollectionParams = {
    metadata: PublicKey;
    collectionAuthority: PublicKey;
    collectionMint: PublicKey;
    updateAuthority: PublicKey;
    collectionMetadata: PublicKey;
    collectionMasterEdition: PublicKey;
    collectionAuthorityRecord?: PublicKey;
};
export declare class SetAndVerifyCollectionCollection extends Transaction {
    constructor(options: TransactionCtorFields, params: SetAndVerifyCollectionParams);
}
export {};
