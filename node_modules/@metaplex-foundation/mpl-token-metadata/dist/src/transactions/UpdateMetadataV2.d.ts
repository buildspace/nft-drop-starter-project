import { Borsh, Transaction } from '@metaplex-foundation/mpl-core';
import { PublicKey, TransactionCtorFields } from '@solana/web3.js';
import { DataV2 } from '../accounts/Metadata';
export declare class UpdateMetadataV2Args extends Borsh.Data<{
    data?: DataV2;
    updateAuthority?: string;
    primarySaleHappened: boolean | null;
    isMutable: boolean | null;
}> {
    static readonly SCHEMA: any;
    instruction: number;
    data: DataV2 | null;
    updateAuthority: string | null;
    primarySaleHappened: boolean | null;
    isMutable: boolean | null;
}
declare type UpdateMetadataV2Params = {
    metadata: PublicKey;
    updateAuthority: PublicKey;
    metadataData?: DataV2;
    newUpdateAuthority?: PublicKey;
    primarySaleHappened?: boolean | null;
    isMutable?: boolean | null;
};
export declare class UpdateMetadataV2 extends Transaction {
    constructor(options: TransactionCtorFields, params: UpdateMetadataV2Params);
}
export {};
