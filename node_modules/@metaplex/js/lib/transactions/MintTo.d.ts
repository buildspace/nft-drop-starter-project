import { PublicKey, TransactionCtorFields } from '@solana/web3.js';
import BN from 'bn.js';
import { Transaction } from '@metaplex-foundation/mpl-core';
declare type MintToParams = {
    mint: PublicKey;
    dest: PublicKey;
    amount: number | BN;
    authority?: PublicKey;
};
export declare class MintTo extends Transaction {
    constructor(options: TransactionCtorFields, params: MintToParams);
}
export {};
