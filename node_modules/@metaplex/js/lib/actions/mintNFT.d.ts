import { PublicKey } from '@solana/web3.js';
import { Connection } from '../Connection';
import { Wallet } from '../wallet';
export interface MintNFTParams {
    connection: Connection;
    wallet: Wallet;
    uri: string;
    maxSupply?: number;
}
export interface MintNFTResponse {
    txId: string;
    mint: PublicKey;
    metadata: PublicKey;
    edition: PublicKey;
}
export declare const mintNFT: ({ connection, wallet, uri, maxSupply, }: MintNFTParams) => Promise<MintNFTResponse>;
