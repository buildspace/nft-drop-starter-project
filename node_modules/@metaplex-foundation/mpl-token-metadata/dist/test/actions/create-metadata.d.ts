import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { TransactionHandler } from '@metaplex-foundation/amman';
import { DataV2, MetadataDataData } from '../../src/mpl-token-metadata';
import * as spl from '@solana/spl-token';
declare type CreateMetadataParams = {
    transactionHandler: TransactionHandler;
    publicKey: PublicKey;
    editionMint: PublicKey;
    metadataData: MetadataDataData;
    updateAuthority?: PublicKey;
};
declare type CreateMetadataV2Params = {
    transactionHandler: TransactionHandler;
    publicKey: PublicKey;
    mint: PublicKey;
    metadataData: DataV2;
    updateAuthority?: PublicKey;
};
export declare function createMetadataV2({ transactionHandler, publicKey, mint, metadataData, updateAuthority, }: CreateMetadataV2Params): Promise<{
    metadata: PublicKey;
    createTxDetails: import("@metaplex-foundation/amman").ConfirmedTransactionDetails;
}>;
export declare function createMetadata({ transactionHandler, publicKey, editionMint, metadataData, updateAuthority, }: CreateMetadataParams): Promise<{
    metadata: PublicKey;
    createTxDetails: import("@metaplex-foundation/amman").ConfirmedTransactionDetails;
}>;
export declare function mintAndCreateMetadata(connection: Connection, transactionHandler: TransactionHandler, payer: Keypair, args: ConstructorParameters<typeof MetadataDataData>[0]): Promise<{
    mint: spl.Token;
    metadata: PublicKey;
}>;
export declare function mintAndCreateMetadataV2(connection: Connection, transactionHandler: TransactionHandler, payer: Keypair, args: DataV2): Promise<{
    mint: spl.Token;
    metadata: PublicKey;
}>;
export declare function createMasterEdition(connection: Connection, transactionHandler: TransactionHandler, payer: Keypair, args: DataV2, maxSupply: number): Promise<{
    mint: spl.Token;
    metadata: PublicKey;
    masterEditionPubkey: PublicKey;
    createTxDetails: import("@metaplex-foundation/amman").ConfirmedTransactionDetails;
}>;
export {};
