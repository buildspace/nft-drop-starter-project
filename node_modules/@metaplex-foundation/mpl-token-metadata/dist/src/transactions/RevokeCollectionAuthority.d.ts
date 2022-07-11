import { Borsh, Transaction } from '@metaplex-foundation/mpl-core';
import { PublicKey, TransactionCtorFields } from '@solana/web3.js';
export declare class RevokeCollectionAuthorityArgs extends Borsh.Data {
    static readonly SCHEMA: any;
    instruction: number;
}
declare type RevokeCollectionAuthorityParams = {
    collectionAuthorityRecord: PublicKey;
    newCollectionAuthority?: PublicKey;
    delegateAuthority?: PublicKey;
    updateAuthority: PublicKey;
    metadata: PublicKey;
    mint: PublicKey;
};
export declare class RevokeCollectionAuthority extends Transaction {
    constructor(options: TransactionCtorFields, params: RevokeCollectionAuthorityParams);
}
export {};
