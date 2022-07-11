import { Borsh, Transaction } from '@metaplex-foundation/mpl-core';
import { PublicKey, TransactionCtorFields } from '@solana/web3.js';
export declare class UpdatePrimarySaleHappenedViaTokenArgs extends Borsh.Data {
    static readonly SCHEMA: any;
    instruction: number;
}
declare type UpdatePrimarySaleHappenedViaTokenParams = {
    metadata: PublicKey;
    owner: PublicKey;
    tokenAccount: PublicKey;
};
export declare class UpdatePrimarySaleHappenedViaToken extends Transaction {
    constructor(options: TransactionCtorFields, params: UpdatePrimarySaleHappenedViaTokenParams);
}
export {};
