import { Borsh, Transaction } from '@metaplex-foundation/mpl-core';
import { PublicKey, TransactionCtorFields } from '@solana/web3.js';
import { DataV2 } from '../accounts/Metadata';
export declare class CreateMetadataV2Args extends Borsh.Data<{
    data: DataV2;
    isMutable: boolean;
}> {
    static readonly SCHEMA: any;
    instruction: number;
    data: DataV2;
    isMutable: boolean;
}
export declare type CreateMetadataV2Params = {
    metadata: PublicKey;
    metadataData: DataV2;
    updateAuthority: PublicKey;
    mint: PublicKey;
    mintAuthority: PublicKey;
};
export declare class CreateMetadataV2 extends Transaction {
    constructor(options: TransactionCtorFields, params: CreateMetadataV2Params);
}
