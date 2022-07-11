/// <reference types="@solana/spl-token" />
import test from 'tape';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { MetadataData, MetadataDataData } from '../../src/mpl-token-metadata';
import { PayerTransactionHandler } from '@metaplex-foundation/amman';
export declare const URI = "uri";
export declare const NAME = "test";
export declare const SYMBOL = "sym";
export declare const SELLER_FEE_BASIS_POINTS = 10;
export declare function initMetadata(): Promise<{
    connection: Connection;
    transactionHandler: PayerTransactionHandler;
    payer: Keypair;
    mint: import("@solana/spl-token").Token;
    metadata: PublicKey;
    initialMetadata: MetadataData;
}>;
export declare function getMetadataData(connection: Connection, metadata: PublicKey): Promise<MetadataData>;
export declare function assertMetadataDataUnchanged(t: test.Test, initial: MetadataData, updated: MetadataData, except?: keyof MetadataData): Promise<void>;
export declare function assertMetadataDataDataUnchanged(t: test.Test, initial: MetadataDataData, updated: MetadataDataData, except: (keyof MetadataDataData)[]): Promise<void>;
