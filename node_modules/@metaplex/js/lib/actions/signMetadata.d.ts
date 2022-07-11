import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { Wallet } from '../wallet';
interface SignMetadataParams {
    connection: Connection;
    wallet: Wallet;
    editionMint: PublicKey;
    signer?: Keypair;
}
export declare const signMetadata: ({ connection, wallet, editionMint, signer }?: SignMetadataParams) => Promise<string>;
export {};
