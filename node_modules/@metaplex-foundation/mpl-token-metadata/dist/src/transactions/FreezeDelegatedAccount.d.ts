import { Borsh, Transaction } from '@metaplex-foundation/mpl-core';
import { PublicKey, TransactionCtorFields } from '@solana/web3.js';
export declare class FreezeDelegatedAccountArgs extends Borsh.Data {
    static readonly SCHEMA: any;
    instruction: number;
}
declare type FreezeDelegatedAccountParams = {
    delegate: PublicKey;
    token_account: PublicKey;
    edition: PublicKey;
    mint: PublicKey;
};
export declare class FreezeDelegatedAccount extends Transaction {
    constructor(options: TransactionCtorFields, params: FreezeDelegatedAccountParams);
}
export {};
