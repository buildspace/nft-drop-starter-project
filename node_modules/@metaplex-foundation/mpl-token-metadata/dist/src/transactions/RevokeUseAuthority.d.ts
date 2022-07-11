import { Borsh, Transaction } from '@metaplex-foundation/mpl-core';
import { PublicKey, TransactionCtorFields } from '@solana/web3.js';
export declare class RevokeUseAuthorityArgs extends Borsh.Data {
    static readonly SCHEMA: any;
    instruction: number;
}
declare type RevokeUseAuthorityParams = {
    useAuthorityRecord: PublicKey;
    user: PublicKey;
    owner: PublicKey;
    ownerTokenAccount: PublicKey;
    metadata: PublicKey;
    mint: PublicKey;
};
export declare class RevokeUseAuthority extends Transaction {
    constructor(options: TransactionCtorFields, params: RevokeUseAuthorityParams);
}
export {};
