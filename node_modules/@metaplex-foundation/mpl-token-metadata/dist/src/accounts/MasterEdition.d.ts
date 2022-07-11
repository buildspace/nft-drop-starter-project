/// <reference types="node" />
import { Borsh, Account, AnyPublicKey, StringPublicKey } from '@metaplex-foundation/mpl-core';
import BN from 'bn.js';
import { Edition } from './Edition';
import { Buffer } from 'buffer';
import { AccountInfo, Connection, PublicKey } from '@solana/web3.js';
import { MetadataKey } from './constants';
declare type ArgsV1 = {
    key: MetadataKey;
    supply: BN;
    maxSupply?: BN;
    printingMint: StringPublicKey;
    oneTimePrintingAuthorizationMint: StringPublicKey;
};
export declare class MasterEditionV1Data extends Borsh.Data<ArgsV1> {
    static readonly SCHEMA: any;
    key: MetadataKey;
    supply: BN;
    maxSupply?: BN;
    printingMint: StringPublicKey;
    oneTimePrintingAuthorizationMint: StringPublicKey;
    constructor(args: ArgsV1);
}
declare type ArgsV2 = {
    key: MetadataKey;
    supply: BN;
    maxSupply?: BN;
};
export declare class MasterEditionV2Data extends Borsh.Data<ArgsV2> {
    static readonly SCHEMA: any;
    key: MetadataKey;
    supply: BN;
    maxSupply?: BN;
    constructor(args: ArgsV2);
}
export declare type MasterEditionData = MasterEditionV1Data | MasterEditionV2Data;
export declare class MasterEdition extends Account<MasterEditionData> {
    static readonly EDITION_PREFIX = "edition";
    constructor(key: AnyPublicKey, info: AccountInfo<Buffer>);
    static getPDA(mint: AnyPublicKey): Promise<PublicKey>;
    static isCompatible(data: Buffer): boolean;
    static isMasterEditionV1(data: Buffer): boolean;
    static isMasterEditionV2(data: Buffer): boolean;
    getEditions(connection: Connection): Promise<Edition[]>;
}
export {};
