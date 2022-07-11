import { Borsh, Transaction } from '@metaplex-foundation/mpl-core';
import { PublicKey, TransactionCtorFields } from '@solana/web3.js';
import BN from 'bn.js';
export declare class MintNewEditionFromMasterEditionViaTokenArgs extends Borsh.Data<{
    edition: BN;
}> {
    static readonly SCHEMA: any;
    instruction: number;
    edition: BN;
}
declare type MintNewEditionFromMasterEditionViaTokenParams = {
    edition: PublicKey;
    metadata: PublicKey;
    updateAuthority: PublicKey;
    mint: PublicKey;
    mintAuthority: PublicKey;
    masterEdition: PublicKey;
    masterMetadata: PublicKey;
    editionMarker: PublicKey;
    tokenOwner: PublicKey;
    tokenAccount: PublicKey;
    editionValue: BN;
};
export declare class MintNewEditionFromMasterEditionViaToken extends Transaction {
    constructor(options: TransactionCtorFields, params: MintNewEditionFromMasterEditionViaTokenParams);
}
export {};
