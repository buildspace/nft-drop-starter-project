import { Borsh, Transaction } from '@metaplex-foundation/mpl-core';
import { TransactionCtorFields } from '@solana/web3.js';
import BN from 'bn.js';
import { CreateMasterEditionParams } from '.';
export declare class CreateMasterEditionV3Args extends Borsh.Data<{
    maxSupply: BN | null;
}> {
    static readonly SCHEMA: any;
    instruction: number;
    maxSupply: BN | null;
}
export declare class CreateMasterEditionV3 extends Transaction {
    constructor(options: TransactionCtorFields, params: CreateMasterEditionParams);
}
