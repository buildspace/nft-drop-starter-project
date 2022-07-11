import { CreateAuctionArgs } from '@metaplex-foundation/mpl-auction';
import { PublicKey, TransactionSignature } from '@solana/web3.js';
import { Wallet } from '../../wallet';
import { Connection } from '../../Connection';
interface MakeAuctionParams {
    connection: Connection;
    wallet: Wallet;
    vault: PublicKey;
    auctionSettings: Omit<CreateAuctionArgs, 'resource' | 'authority'>;
}
interface MakeAuctionResponse {
    txId: TransactionSignature;
    auction: PublicKey;
}
export declare const initAuction: ({ connection, wallet, vault, auctionSettings, }: MakeAuctionParams) => Promise<MakeAuctionResponse>;
export {};
