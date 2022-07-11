import { Borsh, Transaction } from '@metaplex-foundation/mpl-core';
import { PublicKey, TransactionCtorFields } from '@solana/web3.js';
export declare class ApproveCollectionAuthorityArgs extends Borsh.Data {
    static readonly SCHEMA: any;
    instruction: number;
}
declare type ApproveCollectionAuthorityParams = {
    collectionAuthorityRecord: PublicKey;
    newCollectionAuthority: PublicKey;
    updateAuthority: PublicKey;
    metadata: PublicKey;
    mint: PublicKey;
};
export declare class ApproveCollectionAuthority extends Transaction {
    constructor(options: TransactionCtorFields, params: ApproveCollectionAuthorityParams);
}
export {};
