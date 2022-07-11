import { Borsh, Transaction } from '@metaplex-foundation/mpl-core';
import { PublicKey, TransactionCtorFields } from '@solana/web3.js';
import { MetadataDataData } from '../accounts/Metadata';
export declare class CreateMetadataArgs extends Borsh.Data<{
    data: MetadataDataData;
    isMutable: boolean;
}> {
    static readonly SCHEMA: any;
    instruction: number;
    data: MetadataDataData;
    isMutable: boolean;
}
declare type CreateMetadataParams = {
    metadata: PublicKey;
    metadataData: MetadataDataData;
    updateAuthority: PublicKey;
    mint: PublicKey;
    mintAuthority: PublicKey;
};
export declare class CreateMetadata extends Transaction {
    constructor(options: TransactionCtorFields, params: CreateMetadataParams);
}
export {};
