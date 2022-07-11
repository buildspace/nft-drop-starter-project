import { Borsh, Transaction } from '@metaplex-foundation/mpl-core';
import { PublicKey, TransactionCtorFields } from '@solana/web3.js';
export declare class SignMetadataArgs extends Borsh.Data {
    static readonly SCHEMA: any;
    instruction: number;
}
declare type SignMetadataParams = {
    metadata: PublicKey;
    creator: PublicKey;
};
export declare class SignMetadata extends Transaction {
    constructor(options: TransactionCtorFields, params: SignMetadataParams);
}
export {};
