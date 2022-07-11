import { Transaction } from '@metaplex-foundation/mpl-core';
import { PublicKey, TransactionCtorFields } from '@solana/web3.js';
declare type CreateTokenAccountParams = {
    newAccountPubkey: PublicKey;
    lamports: number;
    mint: PublicKey;
    owner?: PublicKey;
};
export declare class CreateTokenAccount extends Transaction {
    constructor(options: TransactionCtorFields, params: CreateTokenAccountParams);
}
export {};
