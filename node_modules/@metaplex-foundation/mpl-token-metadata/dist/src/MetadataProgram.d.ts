import { PublicKey } from '@solana/web3.js';
import { Program } from '@metaplex-foundation/mpl-core';
export declare class MetadataProgram extends Program {
    static readonly PREFIX = "metadata";
    static readonly EDITION = "edition";
    static readonly USER = "user";
    static readonly COLLECTION_AUTHORITY = "collection_authority";
    static readonly BURN = "burn";
    static readonly PUBKEY: PublicKey;
    static findEditionAccount(mint: PublicKey, editionNumber: string): Promise<[PublicKey, number]>;
    static findMasterEditionAccount(mint: PublicKey): Promise<[PublicKey, number]>;
    static findMetadataAccount(mint: PublicKey): Promise<[PublicKey, number]>;
    static findUseAuthorityAccount(mint: PublicKey, authority: PublicKey): Promise<[PublicKey, number]>;
    static findCollectionAuthorityAccount(mint: PublicKey, authority: PublicKey): Promise<[PublicKey, number]>;
    static findProgramAsBurnerAccount(): Promise<[PublicKey, number]>;
}
